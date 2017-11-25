createActionTypes = require './create_action_types'

createReducerContext = (entityName, allTypes, reducer) ->
  {
    types: allTypes[entityName]
    reducer: reducer
    allTypes: allTypes
  }

module.exports = createReducerContext
