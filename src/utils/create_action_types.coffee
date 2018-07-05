actionTypesFor = require '../action_types'
actionTypeFor = require '../action_type'

createActionTypes = (entityName, actions) ->
  actionTypes = {}
  for name, ac of actions
    actionTypes[name] =
      if ['set', 'reset'].includes(name)
        actionTypeFor(name, entityName)
      else
        actionTypesFor(name, entityName)
  actionTypes

module.exports = createActionTypes
