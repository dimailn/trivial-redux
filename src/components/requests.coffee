actions = require './actions'
{cloneDeep} = require 'lodash'

module.exports = (args...) ->
  _actions = {}
  for name, creator of actions(args...)
    _actions[name] = do (creator) -> (creatorArgs...) ->
      action = creator(creatorArgs...)

      if typeof action is 'object'
        action = cloneDeep(action)
        action.isRequest = true
        action
      else
        (dispatch, getState) ->
          wrappedDispatch = (dispatchedAction) ->
            return dispatch(dispatchedAction) unless dispatchedAction.types?

            dispatchedAction = cloneDeep(dispatchedAction)
            dispatchedAction.isRequest = true
            dispatch(dispatchedAction)

          action(wrappedDispatch, getState)

  _actions
