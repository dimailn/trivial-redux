actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'
defaultState   = require '../states/rest'


handleNextPage = (state, action, types) ->
  switch action.type
    when types.load
      Object.assign({}, state, fetching: true)
    when types.success
      Object.assign(
        {}
        state
        fetching: false
        nextPage: if state.nextPage then state.nextPage + 1 else 2
        data: Object.assign({}, state.data, collection: state.data.collection.concat(action.payload))
      )
    when types.failure
      Object.assign({}, state, fetching: false, error: action.response)

createRestReducerFor = (entity_name, initialState) ->
  indexTypes    = actionTypesFor('index', entity_name)
  showTypes     = actionTypesFor('show', entity_name)
  updateTypes   = actionTypesFor('update', entity_name)
  nextPageTypes = actionTypesFor('nextPage', entity_name)

  RESET_ACTION = actionTypeFor('reset', entity_name)
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
      # reset
      when RESET_ACTION
        Object.assign({}, initialState)
      # nextPage
      when nextPageTypes.load, nextPageTypes.success, nextPageTypes.failure
        return state unless action.meta.page == state.nextPage || !state.nextPage?
        handleNextPage(state, action, nextPageTypes)
      when updateTypes.success
        Object.assign(
          {},
          state,
          {
            data: {
              collection: state.data.collection.map (entity) -> if entity.id == action.payload.id then action.payload else entity
              oldCurrent: null
              current: null
            }
            fetching: false
          }
        )
      else
        state

createRestReducerFor.defaultState = defaultState

module.exports = createRestReducerFor
