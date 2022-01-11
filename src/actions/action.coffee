actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'
urlFormat      = require '../utils/url_format'

module.exports = (entity_name, endpoint, settings) ->
  format = urlFormat(settings)

  execute: (data, options = {}) ->
    types: actionTypesFor('execute', entity_name)
    meta:
      fetch: Object.assign({}, {
        url: format(endpoint)
        method: 'POST'
        data
      }, options)
      
  reset: ->
    type: actionTypeFor('reset', entity_name)
