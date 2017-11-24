createActionTypes = require './create_action_types'

createReducerContext = (entityName, allTypes, reducer) ->
  context = {
    types: allTypes[entityName]
    reducer: reducer
    allTypes: allTypes
  }
  Object.freeze(context)

module.exports = createReducerContext
