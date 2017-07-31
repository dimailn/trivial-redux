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

createReducerContext = (entityName, actions, reducer) ->
  context = {}
  context.types   = createActionTypes(entityName, actions)
  context.reducer = reducer
  Object.freeze(context)

module.exports = createReducerContext