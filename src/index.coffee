{components, createApi} = require './components'
plugins                  = require './plugins'
typeFrom                 = require './utils/type_from'
defaultEndpointFor       = require './default_endpoint'

actionTypesFor           = require './action_types'

trivialRedux = (endpoints, settings = {}) ->
  api = createApi()

  for name, endpoint of endpoints
    type = typeFrom(endpoint, settings)

    defaultEndpoint = defaultEndpointFor(endpoint)

    baseEndpoint = Object.assign({}, defaultEndpoint, settings)

    endpoint =
      if endpoint? && typeof endpoint is 'object'
        Object.assign({}, baseEndpoint, endpoint)
      else
        baseEndpoint

    Object.keys(components).forEach (component) ->
      api[component][name] = components[component](name, endpoint, settings, api, type)

    plugins.forEach (plugin) -> plugin(name, endpoint, api)

  api

module.exports = trivialRedux


module.exports.actionTypesFor = (args...) -> actionTypesFor(args...)

module.exports.defaultStates  = require './states'
