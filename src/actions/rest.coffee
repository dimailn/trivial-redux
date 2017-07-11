actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'

module.exports = (entity_name, endpoint, settings) ->
  format = (url) -> if settings?.skipFormat then url else url + '.json'

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
      params = Object.assign({}, params, page: nextPage || 1)
      dispatch(
        types: actionTypesFor('nextPage', entity_name)
        meta:
          fetch:
            url: format(endpoint)
            params: params
      )

