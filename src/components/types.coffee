createActionTypes = require '../utils/create_action_types'

module.exports = (name, endpoint, settings, api, type) ->
  createActionTypes(name, api.actions[name])