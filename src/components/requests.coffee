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
          action = action(dispatch, getState)
          cloneDeep(action)
          action.isRequest = true
          action

  _actions
