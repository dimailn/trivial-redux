module.exports = (name, endpoint, settings, api, type) ->
    api.reducers[name] = createReducer(
      name
      reducers[type]
      endpoint.initialState
      endpoint.reducer
      api.actions[name]
    )