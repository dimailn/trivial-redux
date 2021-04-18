{components, createApi}  = require './components'
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
      customType.reducer.defaultState = customType.initialState if customType.hasOwnProperty('initialState')

      actions = customType.actions?(name, endpoint, settings) || {}
      asyncActions = customType.asyncActions?(name, endpoint, settings) || {}
      api.actions[name]  =  Object.assign(
        {}
        actions
        asyncActions
      )

      api.types[name]    =  createActionTypes(name, actions, asyncActions)
      api.reducers[name] =  createReducer(name, customType.reducer, endpoint, api.types)
    else
      Object.keys(components).forEach (component) ->
        api[component][name] = components[component](name, endpoint, settings, api, type)

    plugins.forEach (plugin) -> plugin(name, endpoint, api)

  api

module.exports = trivialRedux


module.exports.actionTypesFor = (args...) -> actionTypesFor(args...)

module.exports.defaultStates  = require './states'
