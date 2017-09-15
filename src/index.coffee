components        = require './components'
plugins           = require './plugins'
createReducer     = require './utils/create_reducer'
createActionTypes = require './utils/create_action_types'
typeFrom          = require './utils/type_from'

DEFAULT_ENDPOINT_TYPE = 'rest'

trivialRedux = (endpoints, settings = {}) ->
  api =
    actions: {}
    reducers: {}
    types: {}

  for name, endpoint of endpoints
    type = typeFrom(endpoint, settings, DEFAULT_ENDPOINT_TYPE)
    throw "Неизвестный endpoint type \"#{type}\"" unless actions[type]? && reducers[type]?

    Object.keys(api).forEach (component) ->
      api[component][name] = components[componentName](name, endpoint, settings, api, type)

    plugins.forEach (plugin) -> plugin(name, endpoint, api)

  api

module.exports = trivialRedux

module.exports.actionTypesFor = require './action_types'

module.exports.defaultStates  = require './states'
