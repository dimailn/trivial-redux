import { TrivialReduxType, ApiForType, AsyncActionTypes } from "./types"
import createReducer from "./utils/create-reducer"
import createRequestFromAction from "./create-request-from-action"
import createActionTypes from "./utils/create-action-types"
import defaultOptions from "./default-options"

export default function<S, Actions, AsyncActions, AsyncActionsTypes>(
  entityName: string,
  type: TrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes>,
  allTypes: any
): ApiForType<S, Actions, AsyncActions, AsyncActionsTypes> {

  const options = {
    ...defaultOptions(),
    initialState: type.initialState,
    ...type.options
  }




  const syncActions = type.actions(entityName, options)
  const asyncActions = type.asyncActions(entityName, options)

  const actions = {
    ...syncActions,
    ...asyncActions
  } as ReturnType<typeof type.actions> & ReturnType<typeof type.asyncActions>

  const requests = Object.fromEntries(
    Object.entries(type.asyncActions(entityName, options)).map(([actionName, action]) =>
      [actionName, createRequestFromAction(action)]
    )
  ) as ReturnType<typeof type.asyncActions>


  const types = createActionTypes(entityName, syncActions, asyncActions) as {
    [K in keyof ReturnType<typeof type.actions>]: string
  } & {
    [K in keyof ReturnType<typeof type.asyncActions>]: AsyncActionTypes
  }

  const reducer: OmitThisParameter<ReturnType<typeof type.reducer>> = createReducer(entityName, type.reducer, options, allTypes, types)


  return {
    actions,
    requests,
    reducer,
    types
  }
}