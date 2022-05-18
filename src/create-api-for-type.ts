import { TrivialReduxType, ApiForType, AsyncActionTypes } from "./types"
import createReducer from "./utils/create-reducer"
import createRequestFromAction from "./create-request-from-action"
import createActionTypes from "./utils/create-action-types"

export default function<S, Actions, AsyncActions, AsyncActionsTypes>(
  entityName: string,
  type: TrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes>,
  allTypes: any
): ApiForType<S, Actions, AsyncActions, AsyncActionsTypes> {
  const {options} = type

  const types = createActionTypes(entityName, type.actions, type.asyncActions) as {
    [K in keyof ReturnType<typeof type.actions>]: string
  } & {
    [K in keyof ReturnType<typeof type.asyncActions>]: AsyncActionTypes
  }

  const reducer: OmitThisParameter<ReturnType<typeof type.reducer>> = createReducer(entityName, type.reducer, options, allTypes)

  const actions = {
    ...type.actions(entityName, options),
    ...type.asyncActions(entityName, options)
  } as ReturnType<typeof type.actions> & ReturnType<typeof type.asyncActions>

  const requests = Object.fromEntries(
    Object.entries(type.asyncActions(entityName, options)).map(([actionName, action]) =>
      [actionName, createRequestFromAction(action)]
    )
  ) as ReturnType<typeof type.asyncActions>

  return {
    actions,
    requests,
    reducer,
    types
  }
}