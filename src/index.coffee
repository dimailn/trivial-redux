actions       = require './actions'
reducers      = require './reducers'
plugins       = require './plugins'
createReducer = require './utils/create_reducer'

DEFAULT_ENDPOINT_TYPE = 'rest'

trivialRedux = (endpoints, settings) ->
  api =
    actions: {}
    reducers: {}

  for name, endpoint of endpoints
    if typeof endpoint is 'object'
      type = endpoint.type || settings.type || DEFAULT_ENDPOINT_TYPE
      throw "Неизвестный endpoint type \"#{type}\"" unless actions[type]? && reducers[type]?

      api.actions[name]  = actions[type](
        name
        endpoint.entry
        # Применяем глобальные настройки
        Object.assign({}, settings, endpoint)
      )

      api.reducers[name] = createReducer(
        name
        reducers[type]
        endpoint.initialState
        endpoint.reducer
        api.actions[name]
      )

      plugins.forEach (plugin) -> plugin(name, endpoint, api)

    else
      api.actions[name]  = actions[DEFAULT_ENDPOINT_TYPE](name, endpoint)
      api.reducers[name] = createReducer(name, reducers[DEFAULT_ENDPOINT_TYPE])

  api

module.exports = trivialRedux

module.exports.actionTypesFor = require './action_types'
