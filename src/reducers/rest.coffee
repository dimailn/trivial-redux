actionTypesFor = require '../action_types'

defaultState =
  lastUpdatedAt: null
  data:
    collection: []
    current: null
    oldCurrent: null
  fetching: false

createRestReducerFor = (entity_name, initialState) ->
  indexTypes = actionTypesFor('index', entity_name)
  showTypes  = actionTypesFor('show', entity_name)
  (state = initialState, action) ->
    switch action.type
      # index
      when indexTypes.load
        Object.assign({}, state, fetching: true)
      when indexTypes.success
        lastUpdatedAt: new Date().getTime()
        data: Object.assign({}, state.data, collection: action.payload)
        fetching: false
        error: null
      when indexTypes.failure
        Object.assign({}, state, fetching: false, error: action.response)
      # show
      when showTypes.load
        Object.assign({}, state, fetching: true)
      when showTypes.success
        Object.assign(
          {}
          state
          {
            data: Object.assign({}, state.data, current: action.payload)
            fetching: false
          }
        )
      when showTypes.failure
        Object.assign({}, state, fetching: false, error: action.response)
      else
        state

createRestReducerFor.defaultState = defaultState

module.exports = createRestReducerFor
