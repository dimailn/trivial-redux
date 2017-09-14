actions           = require './actions'
reducers          = require './reducers'
plugins           = require './plugins'
createReducer     = require './utils/create_reducer'
createActionTypes = require './utils/create_action_types'

DEFAULT_ENDPOINT_TYPE = 'rest'

typeFrom = (endpoints, settings) ->
  if typeof endpoint is 'object'
    endpoint.type || settings.type || DEFAULT_ENDPOINT_TYPE
  else
    DEFAULT_ENDPOINT_TYPE

trivialRedux = (endpoints, settings = {}) ->
  api =
    actions: {}
    reducers: {}
    types: {}

  for name, endpoint of endpoints
    type = typeFrom(endpoint, settings)
    throw "Неизвестный endpoint type \"#{type}\"" unless actions[type]? && reducers[type]?
    Object.keys(api).forEach (componentName) -> apiComponents[componentName](name, endpoint, settings, api, type)
    plugins.forEach (plugin) -> plugin(name, endpoint, api)

    # if typeof endpoint is 'object'

    #   api.actions[name]  = actions[type](
    #     name
    #     endpoint.entry
    #     # Применяем глобальные настройки
    #     Object.assign({}, settings, endpoint)
    #   )

    #   api.reducers[name] = createReducer(
    #     name
    #     reducers[type]
    #     endpoint.initialState
    #     endpoint.reducer
    #     api.actions[name]
    #   )

    #   api.types[name] = createActionTypes(name, api.actions[name])


    # else
    #   api.actions[name]  = actions[DEFAULT_ENDPOINT_TYPE](name, endpoint)
    #   api.reducers[name] = createReducer(name, reducers[DEFAULT_ENDPOINT_TYPE])

    #   api.types[name]    = createActionTypes(name, api.actions[name])

  api

module.exports = trivialRedux

module.exports.actionTypesFor = require './action_types'

module.exports.defaultStates  = require './states'
