components = {createApi} = require './components'
plugins                  = require './plugins'
typeFrom                 = require './utils/type_from'
defaultEndpointFor       = require './default_endpoint'

trivialRedux = (endpoints, settings = {}) ->
  api = createApi()

  for name, endpoint of endpoints
    type = typeFrom(endpoint, settings)

    defaultEndpoint = defaultEndpointFor(endpoint)

    endpoint = 
      if typeof endpoint is 'string'
        defaultEndpoint
      else
        endpoint = Object.assign({}, defaultEndpoint, endpoint)

    Object.keys(components).forEach (component) ->
      api[component][name] = components[component](name, endpoint, settings, api, type)

    plugins.forEach (plugin) -> plugin(name, endpoint, api)

  api

module.exports = trivialRedux

module.exports.actionTypesFor = require './action_types'

module.exports.defaultStates  = require './states'
