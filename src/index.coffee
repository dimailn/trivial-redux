{components, createApi} = require './components'
plugins                  = require './plugins'
typeFrom                 = require './utils/type_from'
defaultEndpointFor       = require './default_endpoint'

actionTypesFor           = require './action_types'
createReducer            = require './utils/create_reducer'
createActionTypes        = require './utils/create_action_types_from_custom_type'

trivialRedux = (endpoints, settings = {}) ->
  api = createApi()

  settings.types ||= []

  customTypes = settings.types.reduce(
    (obj, type) -> 
      throw "[trivial-redux] Name for custom endpoint type is required" unless type.name
      obj[type.name] = type
      obj
    {}
  )

  for name, endpoint of endpoints
    [type, isCustom] = typeFrom(endpoint, settings)
    throw "Unknown endpoint type \"#{type}\"" if isCustom && !customTypes[type]?

    defaultEndpoint = defaultEndpointFor(endpoint)

    baseEndpoint = Object.assign({}, defaultEndpoint, settings)

    endpoint =
      if endpoint? && typeof endpoint is 'object'
        Object.assign({}, baseEndpoint, endpoint)
      else
        baseEndpoint

    customType = customTypes[type]

    if customType?
      api.types[name]    =  createActionTypes(name, customType)
      api.reducers[name] =  createReducer(name, customType.reducer, endpoint, api.types)
      api.actions[name]  =  Object.assign(
        {}
        customType.actions?(name, endpoint, settings) || {}
        customType.asyncActions?(name, endpoint, settings) || {}
      )
    else
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
