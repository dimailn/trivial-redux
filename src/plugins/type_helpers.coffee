actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'

module.exports = (name, endpoint, api) ->
  api.typeFor  = actionTypeFor
  api.typesFor = actionTypesFor

  api.parseType = (type) -> 
    tokens = type.split('/')

    {
      action: tokens[0]
      endpoint: tokens[1]
      status: tokens[2]
    }
