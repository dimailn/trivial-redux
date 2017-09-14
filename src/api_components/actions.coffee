module.exports = (name, endpoint, settings, api, type) ->
  api.actions[name]  = actions[type](
    name
    endpoint.entry
    # Применяем глобальные настройки
    if endpoint instanceof Object then Object.assign({}, settings, endpoint) else {}
  )
