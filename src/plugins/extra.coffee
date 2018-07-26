_ = require 'lodash'

applyExtra = (actions, extra) ->
  actionsWithExtra = {}
  for actionName, actionCreator of actions
    do (actionCreator) ->
      actionsWithExtra[actionName] =  (args...) ->
        action = actionCreator(args...)
        if typeof action is 'function'
          (dispatch, getState, extraArgument) ->
            dispatchWrapper = (a) -> dispatch(_.merge(_.cloneDeep(a), extra))
            action(dispatchWrapper, getState, extraArgument)
        else
          _.merge(_.cloneDeep(action), extra)


  actionsWithExtra

module.exports = (name, endpoint, api) ->
  if endpoint.extra
    api.actions[name] = applyExtra(api.actions[name], endpoint.extra)
    api.requests[name] = applyExtra(api.requests[name], endpoint.extra)