actionTypesFor = require '../action_types'

createActionTypes = (entityName, actions) ->
  actionTypes = {}
  for name, ac of actions
    actionTypes[name] = actionTypesFor(name, entityName)
  actionTypes

createReducerContext = (entityName, actions, reducer) ->
  context = {}
  context.types   = createActionTypes(entityName, actions)
  context.reducer = reducer
  Object.freeze(context)

module.exports = createReducerContext