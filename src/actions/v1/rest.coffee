actionTypesFor = require '../../action_types'
actionTypeFor  = require '../../action_type'
urlFormat      = require '../../utils/url_format'

module.exports = (entity_name, endpoint, settings) ->
  format = urlFormat(settings)

  index: (params) ->
    types: actionTypesFor('index', entity_name)
    meta:
      fetch:
        url: format(endpoint)
        params: params
  show: (id) ->
    types: actionTypesFor('show', entity_name)
    meta:
      fetch:
        url:  format("#{endpoint}/#{id}")
  create: (data) ->
    types: actionTypesFor('create', entity_name)
    meta:
      fetch:
        url: format(endpoint)
        data: data
        method: 'POST'
  update: (id, data) ->
    types: actionTypesFor('update', entity_name)
    meta:
      fetch:
        url: format("#{endpoint}/#{id}")
        method: "PUT"
        data: data
  destroy: (id) ->
    types: actionTypesFor('destroy', entity_name)
    meta:
      fetch:
        url: format("#{endpoint}/#{id}")
        method: "DELETE"
  reset: ->
    type: actionTypeFor('reset', entity_name)

  nextPage: (params) ->
    (dispatch, getState) ->
      { nextPage } = getState()[entity_name]
      params = Object.assign({}, page: nextPage || 1, params)
      dispatch(
        types: actionTypesFor('nextPage', entity_name)
        meta:
          fetch:
            url: format(endpoint)
            params: params
          page: params.page
      )

