actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'
defaultState   = require '../states/rest'


handleNextPage = (state, action, types) ->
  switch action.type
    when types.load
      state.fetching = true
    when types.success
      state.fetching = false
      state.nextPage = if state.nextPage then state.nextPage + 1 else 2
      state.data.collection = state.data.collection.concat(action.payload)
    when types.failure
      state.fetching = false
      state.error = action.response


createRestReducerFor = (entity_name, initialState) ->
  (state = initialState, action) ->
    switch action.type
      # index
      when @types.index.load
        state.fetching = true
      when @types.index.success
        state.lastUpdatedAt = new Date().getTime()
        state.data.collection = action.payload
        state.fetching = false
        state.error = null
      when @types.index.failure
        state.fetching = false
        state.error = action.response
      # show
      when @types.show.load
        state.fetching = true
      when @types.show.success
        state.data.current = action.payload
        state.fetching = false
      when @types.show.failure
        state.fetching = false
        state.error = action.response
      # reset
      when @types.reset
        Object.keys(initialState).forEach((key) => state[key] = initialState[key])
      # nextPage
      when @types.nextPage.load, @types.nextPage.success, @types.nextPage.failure
        if action.meta.page == state.nextPage || !state.nextPage?
          handleNextPage.bind(@)(state, action, @types.nextPage)
      when @types.update.success
        state.fetching = false
        state.data = {
          collection: state.data.collection.map (entity) -> if entity.id == action.payload.id then action.payload else entity
          oldCurrent: null
          current: null
        }
      else
        return state

    return

createRestReducerFor.defaultState = defaultState

module.exports = createRestReducerFor
