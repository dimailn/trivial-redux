module.exports = (name, endpoint, settings, api, type) ->
  api.types[name] = createActionTypes(name, api.actions[name])