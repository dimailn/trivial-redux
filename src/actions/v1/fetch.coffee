actionTypesFor = require '../../action_types'
actionTypeFor  = require '../../action_type'
urlFormat      = require '../../utils/url_format'

module.exports = (entity_name, endpoint, settings) ->
  format = urlFormat(settings)

  fetch: (idOrData, data) ->
    if idOrData instanceof Object
      data = idOrData
    else
      id = idOrData

    types: actionTypesFor('fetch', entity_name)
    meta:
      fetch:
        url: format(if id? then "#{endpoint}/#{id}" else endpoint)
        params: data

  reset: ->
    type: actionTypeFor('reset', entity_name)