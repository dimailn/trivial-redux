actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'
defaultState   = require '../states/fetch'

createActionReducerFor = (entity_name, initialState) ->
  (state = initialState, action) ->
    switch action.type
      when @types.execute.load
        Object.assign({}, state, pending: true)
      when @types.execute.success
        lastExecutedAt: new Date().getTime(), data: action.payload, pending: false
      when @types.execute.failure
        Object.assign({}, state, data: action.payload, pending: false)
      when @types.reset
        Object.assign({}, state, initialState)
      else
        state

createActionReducerFor.defaultState = defaultState

module.exports = createActionReducerFor
