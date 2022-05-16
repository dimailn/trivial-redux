interface TrivialReduxEndpointOptions<S> {
  initialState?: S
  skipFormat: boolean
  entry: string
}


type ActionsGenerator<T, S> = (entityName: string, options: TrivialReduxEndpointOptions<S>) => T

export interface TrivialReduxType<S, Actions, AsyncActions, Requests, AsyncActionsTypes> {
  name: string
  initialState: S
  actions: ActionsGenerator<Actions, S>
  asyncActions: ActionsGenerator<AsyncActions, S>
  reducer: (entityName: string, initialState: S) => (this: {
    types: {
      [K in keyof ReturnType<ActionsGenerator<Actions, S>>]: string
    } & {
      [K in keyof ReturnType<ActionsGenerator<AsyncActions, S>>]: {
        load: string
        success: string
        failure: string
      }
    }
    allTypes: any
  }, state: S, action: any) => S | void,
  asyncActionsTypes?: AsyncActionsTypes
}

type ApiForType<S, A, AA, R, AAT> = {
  actions: ReturnType<TrivialReduxType<S, A, AA, R, AAT>['actions']> & ReturnType<TrivialReduxType<S, A, AA, R, AAT>['asyncActions']>
  requests: ReturnType<TrivialReduxType<S, A, AA, R, AAT>['asyncActions']>
  reducer: OmitThisParameter<ReturnType<TrivialReduxType<S, A, AA, R, AAT>['reducer']>>,
  types: {
    [K in keyof ReturnType<TrivialReduxType<S, A, AA, R, AAT>['actions']>]: string
  } & {
    [K in keyof ReturnType<TrivialReduxType<S, A, AA, R, AAT>['asyncActions']>]: string
  }
  asyncActionTypes?: TrivialReduxType<S, A, AA, R, AAT>['asyncActionsTypes']
}

export type Api<T extends Record<string, any>> = {
  actions: {
    [K in keyof T]: T[K]['actions']
  }
  requests: {
    [K in keyof T]: T[K]['requests']
  }
  reducers: {
    [K in keyof T]: T[K]['reducer']
  }
  types: {
    [K in keyof T]: T[K]['types']
  },
  asyncActionsTypes: {
    [K in keyof T]: T[K]['asyncActionTypes']
  }
}

export type WrappedApi<T extends Record<string, any>> = {
  actions: {
    [K in keyof T['actions']]: {
      [A in keyof T['asyncActionsTypes'][K]]: (...args: Parameters<T['actions'][K][A]>) => Promise<ReturnType<T['asyncActionsTypes'][K][A]>>
    }
  }
  requests: {
    [K in keyof T['actions']]: {
      [A in keyof T['asyncActionsTypes'][K]]: (...args: Parameters<T['actions'][K][A]>) => Promise<ReturnType<T['asyncActionsTypes'][K][A]>>
    }
  }
}

export const createApiForType = function<S, A, AA, R, AAT>(
  type: TrivialReduxType<S, A, AA, R, AAT>,
  name: string,
  settings: any
): ApiForType<S, A, AA, R, AAT> {

  const reducer: OmitThisParameter<ReturnType<typeof type.reducer>> = function (state, action) {
    return null
  }

  return {
    actions: {} as ReturnType<typeof type.actions> & ReturnType<typeof type.asyncActions>,
    requests: {} as ReturnType<typeof type.asyncActions>,
    reducer,
    types: {} as  {
      [K in keyof ReturnType<typeof type.actions>]: string
    } & {
      [K in keyof ReturnType<typeof type.asyncActions>]: string
    }
  }
}

export const combineEndpoints = <T>(endpoints: T) : Api<T> => {

  return {
    actions: {},
    requests: {},
    types: {},
    reducers: {}
  }
}

export const useApi = () : WrappedApi<typeof api> => {
  return {
    actions: {},
    requests: {}
  }
}



