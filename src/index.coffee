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


module.exports.actionTypesFor = (args...) ->
  console.warn(
    "[trivial-redux] actionTypesFor helper is deprecated and will be removed in next major version. Use this.allTypes in the reducers or api.typesFor otherwise instead."
  )
  actionTypesFor(args...)

module.exports.defaultStates  = require './states'
