actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'

module.exports = (entity_name, endpoint, settings) ->
  fetch: (idOrData, data) ->
    if idOrData instanceof Object
      data = idOrData
    else
      id = idOrData

    types: actionTypesFor('fetch', entity_name)
    meta:
      fetch:
        url: (if id? then "#{endpoint}/#{id}" else endpoint) + if settings?.skipFormat then '' else '.json'
        params: data

  reset: ->
    type: actionTypeFor('reset', entity_name)