export type IActions = {
  [name: string]: (...args: any) => any
}

export type ActionsWithPartial<Actions extends IActions, Type> = {
  [Action in keyof Actions]: (...args: Parameters<Actions[Action]>) => ReturnType<Actions[Action]> & Type
}

type ActionsGenerator<T extends IActions, S, Actions extends IActions, AsyncActions extends IActions, Partial> =
  (entityName: string, options: TrivialReduxEndpointOptions<S, Actions, AsyncActions>) => ActionsWithPartial<T, Partial>

export interface AsyncActionTypes  {
  load: string
  success: string
  failure: string
}

export interface SyncActionPartial {
  type: string
}

export interface RequestPartial extends AsyncActionPartial {
  isRequest: true
}

export interface AsyncActionPartial {
  types: AsyncActionTypes
}

type TrivialReduxReducer<Actions extends IActions, AsyncActions extends IActions, S, ReducerReturnValue> = (this: {
  types: {
    [K in keyof ReturnType<ActionsGenerator<Actions, S, Actions, AsyncActions, SyncActionPartial>>]: string
  } & {
    [K in keyof ReturnType<ActionsGenerator<AsyncActions, S, Actions, AsyncActions, AsyncActionPartial>>]: AsyncActionTypes
  }
  allTypes: any
}, state: S, action: any) => ReducerReturnValue


type TrivialReduxInnerReducer<Actions extends IActions, AsyncActions extends IActions, S> = TrivialReduxReducer<Actions, AsyncActions, S, S | void>
type TrivialReduxExternalReducer<Actions extends IActions, AsyncActions extends IActions, S> = TrivialReduxReducer<Actions, AsyncActions, S, S>


export interface TrivialReduxCommonOptions {
  skipFormat?: boolean
  host?: string
  stateless?: boolean
  extra?: any
}
export type TrivialReduxEndpointOptions<S, Actions extends IActions, AsyncActions extends IActions> =  {
  initialState?: DeepPartial<S>
  entry?: string
  reducer?: TrivialReduxInnerReducer<Actions, AsyncActions, S>
} &  TrivialReduxCommonOptions


type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface TrivialReduxType<S, Actions extends IActions, AsyncActions extends IActions, AsyncActionsTypes,  SyncActionType, AsyncActionType> {
  name: string
  actions: ActionsGenerator<Actions, S, Actions, AsyncActions, SyncActionType>
  asyncActions: ActionsGenerator<AsyncActions, S, Actions, AsyncActions, AsyncActionType>
  reducer: (entityName: string, initialState: S) => OmitThisParameter<TrivialReduxExternalReducer<Actions, AsyncActions, S>>
  asyncActionsTypes?: AsyncActionsTypes
  options: TrivialReduxEndpointOptions<S, Actions, AsyncActions>
}

export type InternalTrivialReduxType<S, Actions extends IActions, AsyncActions extends IActions, AsyncActionsTypes> =
  TrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes, {}, {}>

export type ExternalTrivialReduxType<S, Actions extends IActions, AsyncActions extends IActions, AsyncActionsTypes> =
  TrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes, SyncActionPartial, AsyncActionPartial>



export type ApiForType<S, A extends IActions, AA extends IActions, AAT> = {
  actions?: ReturnType<ExternalTrivialReduxType<S, A, AA, AAT>['actions']> & ReturnType<ExternalTrivialReduxType<S, A, AA, AAT>['asyncActions']>
  requests: ReturnType<ExternalTrivialReduxType<S, A, AA, AAT>['asyncActions']>
  reducer?: OmitThisParameter<ReturnType<ExternalTrivialReduxType<S, A, AA, AAT>['reducer']>>,
  types: {
    [K in keyof ReturnType<ExternalTrivialReduxType<S, A, AA, AAT>['actions']>]: string
  } & {
    [K in keyof ReturnType<ExternalTrivialReduxType<S, A, AA, AAT>['asyncActions']>]: AsyncActionTypes
  }
  asyncActionTypes?: ExternalTrivialReduxType<S, A, AA, AAT>['asyncActionsTypes'],
}

export type SatelessApiForType<S, A extends IActions, AA extends IActions, AAT> = Omit<ApiForType<S, A, AA, AAT>, 'reducer' | 'actions'>

type TrivialReduxTypeDescriptor = {
  actions: (...args: any) => IActions
  asyncActions:  (...args: any) => IActions
  reducer: (...args: any) => IActions
  asyncActionsTypes: (...args: any) => any
}

type ApiForTypeAbstract<TrivialReduxType extends TrivialReduxTypeDescriptor> = {
  actions: ActionsWithPartial<ReturnType<TrivialReduxType['actions']>, SyncActionPartial> & ActionsWithPartial<ReturnType<TrivialReduxType['asyncActions']>, AsyncActionPartial>
  requests: ActionsWithPartial<ReturnType<TrivialReduxType['asyncActions']>, RequestPartial>
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
      [A in keyof T['actions'][K]]:  T['asyncActionsTypes'][K][A] extends (...args: any[]) => any ? (...args: Parameters<T['actions'][K][A]>) => Promise<ReturnType<T['asyncActionsTypes'][K][A]>> :  (...args: Parameters<T['actions'][K][A]>) => void
    }
  }
  requests: {
    [K in keyof T['actions']]: {
      [A in keyof T['asyncActionsTypes'][K]]: (...args: Parameters<T['actions'][K][A]>) => Promise<ReturnType<T['asyncActionsTypes'][K][A]>>
    }
  }
}


