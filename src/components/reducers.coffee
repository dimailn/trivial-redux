reducers          = require '../reducers'

module.exports = (name, endpoint, settings, api, type) ->
  if typeof endpoint is 'object'
    createReducer(
      name
      reducers[type]
      endpoint.initialState
      endpoint.reducer
      api.actions[name]
    )
  else
    createReducer(name, reducers[DEFAULT_ENDPOINT_TYPE])