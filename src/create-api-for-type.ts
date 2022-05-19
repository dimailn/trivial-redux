import { TrivialReduxType, ApiForType, AsyncActionTypes, TrivialReduxCommonOptions } from "./types"
import createReducer from "./utils/create-reducer"
import createRequestFromAction from "./create-request-from-action"
import createActionTypes from "./utils/create-action-types"
import defaultOptions from "./default-options"

export default function<S, Actions, AsyncActions, AsyncActionsTypes>(
  entityName: string,
  type: TrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes>,
  allTypes: any,
  settings: TrivialReduxCommonOptions
): ApiForType<S, Actions, AsyncActions, AsyncActionsTypes> {

  const options = {
    ...defaultOptions(),
    ...settings,
    initialState: type.initialState,
    ...type.options
  }

  const {stateless} = options

  const syncActions = type.actions(entityName, options)
  const asyncActions = type.asyncActions(entityName, options)

  const actions = {
    ...syncActions,
    ...asyncActions
  } as ReturnType<typeof type.actions> & ReturnType<typeof type.asyncActions>

  const requests = Object.fromEntries(
    Object.entries(type.asyncActions(entityName, options)).map(([actionName, action]) =>
      [actionName, (...args) => createRequestFromAction(action(...args))]
    )
  ) as any as ReturnType<typeof type.asyncActions>


  const types = createActionTypes(entityName, syncActions, asyncActions) as {
    [K in keyof ReturnType<typeof type.actions>]: string
  } & {
    [K in keyof ReturnType<typeof type.asyncActions>]: AsyncActionTypes
  }

  const reducer: OmitThisParameter<ReturnType<typeof type.reducer>> = createReducer(entityName, type.reducer, options, allTypes, types)

  
  if(stateless){
    return {
      types,
      requests
    }
  }

  return {
    actions,
    requests,
    reducer,
    types
  }
}