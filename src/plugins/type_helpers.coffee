actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'

module.exports = (name, endpoint, api) ->
  api.typeFor  = actionTypeFor
  api.typesFor = actionTypesFor
