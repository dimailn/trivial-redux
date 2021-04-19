actionTypeFor  = require '../../action_type'

module.exports = (entity_name, endpoint, settings) ->
  set: (data) ->
    type: actionTypeFor('set', entity_name)
    payload: data

  reset: ->
    type: actionTypeFor('reset', entity_name)