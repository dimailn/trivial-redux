actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'
defaultState   = require '../states/fetch'

createFetchReducerFor = (entity_name, initialState) ->
  (state = initialState, action) ->
    switch action.type
      when @types.fetch.load
        Object.assign({}, state, fetching: true)
      when @types.fetch.success
        lastUpdatedAt: new Date().getTime(), data: action.payload, fetching: false
      when @types.fetch.failure
        Object.assign({}, state, data: action.payload, fetching: false)
      when @types.reset
        Object.assign({}, state, initialState)
      else
        state

createFetchReducerFor.defaultState = defaultState

module.exports = createFetchReducerFor
