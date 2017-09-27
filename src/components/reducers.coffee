reducers          = require '../reducers'
createReducer     = require '../utils/create_reducer'

module.exports = (name, endpoint, settings, api, type) ->
  createReducer(
    name
    reducers[type]
    endpoint.initialState
    endpoint.reducer
    api.actions[name]
  )
