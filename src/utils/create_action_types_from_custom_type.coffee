actionTypesFor = require '../action_types'
actionTypeFor = require '../action_type'

createActionTypes = (entityName, customType) ->
  actionTypes = {}
  for name, ac of customType.asyncActions
    actionTypes[name] = actionTypesFor(name, entityName)

  for name, ac of customType.actions
    actionTypes[name] = actionTypeFor(name, entityName)
  
  actionTypes

module.exports = createActionTypes
