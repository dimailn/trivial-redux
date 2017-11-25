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
  (state = initialState, action) ->
    switch action.type
      # index
      when @types.index.load
        Object.assign({}, state, fetching: true)
      when @types.index.success
        lastUpdatedAt: new Date().getTime()
        data: Object.assign({}, state.data, collection: action.payload)
        fetching: false
        error: null
      when @types.index.failure
        Object.assign({}, state, fetching: false, error: action.response)
      # show
      when @types.show.load
        Object.assign({}, state, fetching: true)
      when @types.show.success
        Object.assign(
          {}
          state
          {
            data: Object.assign({}, state.data, current: action.payload)
            fetching: false
          }
        )
      when @types.show.failure
        Object.assign({}, state, fetching: false, error: action.response)
      # reset
      when @types.reset
        Object.assign({}, initialState)
      # nextPage
      when @types.nextPage.load, @types.nextPage.success, @types.nextPage.failure
        return state unless action.meta.page == state.nextPage || !state.nextPage?
        handleNextPage.bind(@)(state, action, @types.nextPage)
      when @types.update.success
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
