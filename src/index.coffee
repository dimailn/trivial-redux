actions  = require './actions'
reducers = require './reducers'

DEFAULT_ENDPOINT_TYPE = 'rest'

trivialRedux = (endpoints, settings) ->
  api =
    actions: {}
    reducers: {}

  for name, endpoint of endpoints
    if typeof endpoint is 'object'
      type = endpoint.type || DEFAULT_ENDPOINT_TYPE
      throw "Неизвестный endpoint type \"#{type}\"" unless actions[type]? && reducers[type]?

      api.actions[name]  = actions[type](
        name
        endpoint.entry
        # Применяем глобальные настройки
        Object.assign({}, endpoint, settings)
      )

      api.reducers[name] = reducers[type](
        name
        endpoint.initialState || reducers[type].defaultState
        endpoint.reducer
      )

      plugins.each (plugin) -> plugin(name, endpoint, api)

    else
      api.actions[name]  = actions[DEFAULT_ENDPOINT_TYPE](name, endpoint)
      api.reducers[name] = reducers[DEFAULT_ENDPOINT_TYPE](name)

  api

module.exports = trivialRedux

module.exports.actionTypesFor = require './action_types'