createActionTypes = require './create_action_types'

createReducerContext = (entityName, allTypes, reducer) ->
  context = {}
  context.types   = allTypes[entityName]
  context.reducer = reducer
  Object.freeze(context)

module.exports = createReducerContext
