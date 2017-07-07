actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'

defaultState =
  lastUpdatedAt: null
  data: null
  fetching: false

createFetchReducerFor = (entity_name, initialState) ->
  indexTypes = actionTypesFor('fetch', entity_name)
  RESET_ACTION = actionTypeFor('reset', entity_name)
  (state = initialState, action) ->
    switch action.type
      when indexTypes.load
        Object.assign({}, state, fetching: true)
      when indexTypes.success
        lastUpdatedAt: new Date().getTime(), data: action.payload, fetching: false
      when indexTypes.failure
        Object.assign({}, state, data: action.payload, fetching: false)
      when RESET_ACTION
        Object.assign({}, state, data: null, lastUpdatedAt: null)
      else
        state

createFetchReducerFor.defaultState = defaultState

module.exports = createFetchReducerFor
