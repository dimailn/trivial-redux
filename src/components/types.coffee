module.exports = (name, endpoint, settings, api, type) ->
  createActionTypes(name, api.actions[name])