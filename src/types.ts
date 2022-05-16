interface TrivialReduxEndpointOptions<S> {
  initialState?: S
}


type ActionsGenerator<T> = (entityName, endpoint, settings) => T

interface TrivialReduxType<S, Actions, AsyncActions, Requests, AsyncActionsTypes> {
  name: string
  initialState: S
  actions: ActionsGenerator<Actions>
  asyncActions: ActionsGenerator<AsyncActions>
  requests: ActionsGenerator<Requests>
  reducer: (entityName: string, initialState: S) => (this: {
    types: {
      [K in keyof ReturnType<ActionsGenerator<Actions>>]: string
    }

  }, state: S, action: any) => S | void,
  asyncActionsTypes?: AsyncActionsTypes
}

type ApiForType<S, A, AA, R, AAT> = {
  actions: ReturnType<TrivialReduxType<S, A, AA, R, AAT>['actions']> & ReturnType<TrivialReduxType<S, A, AA, R, AAT>['asyncActions']>
  requests: ReturnType<TrivialReduxType<S, A, AA, R, AAT>['requests']>
  reducer: OmitThisParameter<ReturnType<TrivialReduxType<S, A, AA, R, AAT>['reducer']>>,
  types: {
    [K in keyof ReturnType<TrivialReduxType<S, A, AA, R, AAT>['actions']>]: string
  } & {
    [K in keyof ReturnType<TrivialReduxType<S, A, AA, R, AAT>['asyncActions']>]: string
  } & {
    [K in keyof ReturnType<TrivialReduxType<S, A, AA, R, AAT>['requests']>]: string
  },
  asyncActionTypes?: TrivialReduxType<S, A, AA, R, AAT>['asyncActionsTypes']
}

type Api<T extends Record<string, any>> = {
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

type WrappedApi<T extends Record<string, any>> = {
  actions: {
    [K in keyof T['actions']]: {
      [A in keyof T['asyncActionsTypes'][K]]: (...args: Parameters<T['actions'][K][A]>) => Promise<ReturnType<T['asyncActionsTypes'][K][A]>>
    }
  }
  requests: {
    [K in keyof T['requests']]: T['requests'][K]
  }
}

const createApiForType = function<S, A, AA, R, AAT>(
  type: TrivialReduxType<S, A, AA, R, AAT>,
  name: string,
  settings: any
): ApiForType<S, A, AA, R, AAT> {

  const reducer: OmitThisParameter<ReturnType<typeof type.reducer>> = function (state, action) {
    return null
  }

  return {
    actions: {} as ReturnType<typeof type.actions> & ReturnType<typeof type.asyncActions>,
    requests: {} as ReturnType<typeof type.requests>,
    reducer,
    types: {} as  {
      [K in keyof ReturnType<typeof type.actions>]: string
    } & {
      [K in keyof ReturnType<typeof type.asyncActions>]: string
    } & {
      [K in keyof ReturnType<typeof type.requests>]: string
    }
  }
}

const combineEndpoints = <T>(endpoints: T) : Api<T> => {

  return {
    actions: {},
    requests: {},
    types: {},
    reducers: {}
  }
}

const useApi = () : WrappedApi<typeof api> => {
  return {
    actions: {},
    requests: {}
  }
}
