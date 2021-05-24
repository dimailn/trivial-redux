actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'
defaultState   = require '../states/fetch'

createFetchReducerFor = (entity_name, initialState) ->
  (state = initialState, action) ->
    switch action.type
      when @types.fetch.load
        state.fetching = true
      when @types.fetch.success
        state.lastUpdatedAt = new Date().getTime()
        state.data = action.payload
        state.fetching = false
      when @types.fetch.failure
        state.data = action.payload
        state.fetching = false
      when @types.reset
        Object.keys(initialState).forEach((key) => state[key] = initialState[key])
      else
        return state

    return
createFetchReducerFor.defaultState = defaultState

module.exports = createFetchReducerFor
