components = {createApi} = require './components'
plugins                  = require './plugins'
typeFrom                 = require './utils/type_from'
defaultEndpointFor       = require './default_endpoint'

trivialRedux = (endpoints, settings = {}) ->
  api = createApi()

  for name, endpoint of endpoints
    type = typeFrom(endpoint, settings)

    endpoint = defaultEndpointFor(endpoint) if typeof endpoint is 'string'

    Object.keys(components).forEach (component) ->
      api[component][name] = components[component](name, endpoint, settings, api, type)

    plugins.forEach (plugin) -> plugin(name, endpoint, api)

  api

module.exports = trivialRedux

module.exports.actionTypesFor = require './action_types'

module.exports.defaultStates  = require './states'
