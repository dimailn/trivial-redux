actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'
defaultState   = require '../states/fetch'

createActionReducerFor = (entity_name, initialState) ->
  (state = initialState, action) ->
    switch action.type
      when @types.execute.load
        state.pending = true
      when @types.execute.success
        state.lastExecutedAt = new Date().getTime()
        state.data = action.payload
        state.pending = false
      when @types.execute.failure
        state.data = action.payload
        state.pending = false
      when @types.reset
        Object.keys(initialState).forEach((key) => state[key] = initialState[key])
      else
        return state

    return

createActionReducerFor.defaultState = defaultState

module.exports = createActionReducerFor
