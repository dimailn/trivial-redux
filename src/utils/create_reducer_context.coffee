createActionTypes = require './create_action_types'

createReducerContext = (entityName, actions, reducer) ->
  context = {}
  context.types   = createActionTypes(entityName, actions)
  context.reducer = reducer
  Object.freeze(context)


module.exports = createReducerContext
