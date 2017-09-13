actionTypesFor = require '../action_types'
actionTypeFor = require '../action_type'

createActionTypes = (entityName, actions) ->
  actionTypes = {}
  for name, ac of actions
    actionTypes[name] =
      if name is 'reset'
        actionTypeFor(name, entityName)
      else
        actionTypesFor(name, entityName)
  actionTypes

module.exports = createActionTypes
