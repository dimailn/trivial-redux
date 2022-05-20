export type IActions = {
  [name: string]: (...args: any) => any
}

export type ActionsWithType<Actions extends IActions, Type> = {
  [Action in keyof Actions]: (...args: Parameters<Actions[Action]>) => ReturnType<Actions[Action]> & Type
}

type ActionsGenerator<T extends IActions, S, Actions extends IActions, AsyncActions extends IActions, ActionType> =
  (entityName: string, options: TrivialReduxEndpointOptions<S, Actions, AsyncActions>) => ActionsWithType<T, ActionType>

export interface AsyncActionTypes  {
  load: string
  success: string
  failure: string
}

export interface SyncActionType {
  type: string
}

export interface AsyncActionType {
  types: AsyncActionTypes
}

type TrivialReduxReducer<Actions extends IActions, AsyncActions extends IActions, S, ReducerReturnValue> = (this: {
  types: {
    [K in keyof ReturnType<ActionsGenerator<Actions, S, Actions, AsyncActions, SyncActionType>>]: string
  } & {
    [K in keyof ReturnType<ActionsGenerator<AsyncActions, S, Actions, AsyncActions, AsyncActionType>>]: AsyncActionTypes
  }
  allTypes: any
}, state: S, action: any) => ReducerReturnValue


type TrivialReduxInnerReducer<Actions extends IActions, AsyncActions extends IActions, S> = TrivialReduxReducer<Actions, AsyncActions, S, S | void>
type TrivialReduxExternalReducer<Actions extends IActions, AsyncActions extends IActions, S> = TrivialReduxReducer<Actions, AsyncActions, S, S>


export interface TrivialReduxCommonOptions {
  skipFormat?: boolean
  host?: string
  stateless?: boolean
  extra: any
}
export type TrivialReduxEndpointOptions<S, Actions extends IActions, AsyncActions extends IActions> =  {
  initialState?: S
  entry?: string
  reducer?: TrivialReduxInnerReducer<Actions, AsyncActions, S>
} &  TrivialReduxCommonOptions



export interface TrivialReduxType<S, Actions extends IActions, AsyncActions extends IActions, AsyncActionsTypes> {
  name: string
  initialState: S
  actions: ActionsGenerator<Actions, S, Actions, AsyncActions, {}>
  asyncActions: ActionsGenerator<AsyncActions, S, Actions, AsyncActions, {}>
  reducer: (entityName: string, initialState: S) => OmitThisParameter<TrivialReduxExternalReducer<Actions, AsyncActions, S>>
  asyncActionsTypes?: AsyncActionsTypes
  options: TrivialReduxEndpointOptions<S, Actions, AsyncActions>
}

export type ApiForType<S, A extends IActions, AA extends IActions, AAT> = {
  actions?: ReturnType<TrivialReduxType<S, A, AA, AAT>['actions']> & ReturnType<TrivialReduxType<S, A, AA, AAT>['asyncActions']>
  requests: ReturnType<TrivialReduxType<S, A, AA, AAT>['asyncActions']>
  reducer?: OmitThisParameter<ReturnType<TrivialReduxType<S, A, AA, AAT>['reducer']>>,
  types: {
    [K in keyof ReturnType<TrivialReduxType<S, A, AA, AAT>['actions']>]: string
  } & {
    [K in keyof ReturnType<TrivialReduxType<S, A, AA, AAT>['asyncActions']>]: AsyncActionTypes
  }
  asyncActionTypes?: TrivialReduxType<S, A, AA, AAT>['asyncActionsTypes'],
}

export type SatelessApiForType<S, A extends IActions, AA extends IActions, AAT> = Omit<ApiForType<S, A, AA, AAT>, 'reducer' | 'actions'>

interface TrivialReduxTypeDescriptor {
  actions: (...args: any) => any
  asyncActions: (...args: any) => any
  reducer: (...args: any) => any
  asyncActionsTypes: (...args: any) => any
}

type ApiForTypeAbstract<TrivialReduxType extends TrivialReduxTypeDescriptor> = {
  actions: ReturnType<TrivialReduxType['actions']> & ReturnType<TrivialReduxType['asyncActions']>
  requests: ReturnType<TrivialReduxType['asyncActions']>
  reducer: OmitThisParameter<ReturnType<TrivialReduxType['reducer']>>,
  types: {
    [K in keyof ReturnType<TrivialReduxType['actions']>]: string
  } & {
    [K in keyof ReturnType<TrivialReduxType['asyncActions']>]: AsyncActionTypes
  }
  asyncActionTypes?: TrivialReduxType['asyncActionsTypes']
}

export type Api<T extends Record<string, any>> = {
  actions: {
    [K in keyof T]: ApiForTypeAbstract<T[K]>['actions']
  }
  requests: {
    [K in keyof T]: ApiForTypeAbstract<T[K]>['requests']
  }
  reducers: {
    [K in keyof T]: ApiForTypeAbstract<T[K]>['reducer']
  }
  types: {
    [K in keyof T]: ApiForTypeAbstract<T[K]>['types']
  },
  asyncActionsTypes?: {
    [K in keyof T]: ApiForTypeAbstract<T[K]>['asyncActionTypes']
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




