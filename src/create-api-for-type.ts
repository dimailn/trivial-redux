import { ExternalTrivialReduxType, ApiForType, AsyncActionTypes, TrivialReduxCommonOptions, TrivialReduxEndpointOptions, IActions, ActionsWithPartial, SyncActionPartial, AsyncActionPartial } from "./types"
import createReducer from "./utils/create-reducer"
import createRequestFromAction from "./create-request-from-action"
import createActionTypes from "./utils/create-action-types"
import defaultOptions from "./default-options"
import actionTypeFor from "./action_type"
import actionTypesFor from "./action_types"
import { cloneDeep } from "lodash"
import applyExtra from './plugins/extra'


const syncActionsWithType = <Actions extends IActions>(entityName: string, actions: ActionsWithPartial<Actions, {}>) : ActionsWithPartial<Actions, SyncActionPartial> => {

  return Object.fromEntries(
    Object.entries(actions).map(([name, action]) => [name, (...args) => ({type: actionTypeFor(name, entityName), ...action(...args)})])
  ) as ActionsWithPartial<Actions, SyncActionPartial>
}


const asyncActionsWithType = <Actions extends IActions>(entityName: string, actions: ActionsWithPartial<Actions, {}>) : ActionsWithPartial<Actions, AsyncActionPartial> => {

  return Object.fromEntries(
    Object.entries(actions).map(([name, action]) => {


      return [name, (...args) => {
        const actionResult = action(...args)

        if(typeof actionResult === 'function'){

          return (dispatch, getState) => {
            const wrappedDispatch = (dispatchedAction) => {
              return dispatch({ types: actionTypesFor(name, entityName), ...cloneDeep(dispatchedAction) })
            };

            return actionResult(wrappedDispatch, getState)
          }

        } else {
          return { types: actionTypesFor(name, entityName), ...actionResult}
        }

      }]

    })
  ) as ActionsWithPartial<Actions, AsyncActionPartial>
}


export default function<S, Actions extends IActions, AsyncActions extends IActions, AsyncActionsTypes>(
  entityName: string,
  type: ExternalTrivialReduxType<S, Actions, AsyncActions, AsyncActionsTypes>,
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

  const syncActions = syncActionsWithType(entityName, type.actions(entityName, options))
  const asyncActions = applyExtra(asyncActionsWithType(entityName, type.asyncActions(entityName, options)), options.extra)

  const actions = {
    ...syncActions,
    ...asyncActions
  } as ReturnType<typeof type.actions> & ReturnType<typeof type.asyncActions>

  const requests = Object.fromEntries(
    Object.entries(asyncActions).map(([actionName, action]) =>
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