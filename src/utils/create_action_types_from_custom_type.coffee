actionTypesFor = require '../action_types'
actionTypeFor = require '../action_type'

createActionTypes = (entityName, actions, asyncActions) ->
  actionTypes = {}
  for name, ac of asyncActions
    actionTypes[name] = actionTypesFor(name, entityName)

  for name, ac of actions
    actionTypes[name] = actionTypeFor(name, entityName)

  actionTypes

module.exports = createActionTypes
