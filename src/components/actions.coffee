actions           = require '../actions'

module.exports = (name, endpoint, settings, api, type) ->
  if typeof endpoint is 'object'
    actions[type](
      name
      endpoint.entry
      # Применяем глобальные настройки
      if endpoint instanceof Object then Object.assign({}, settings, endpoint) else {}
    )
  else
    actions[DEFAULT_ENDPOINT_TYPE](name, endpoint)
