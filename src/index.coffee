actions  = require './actions'
reducers = require './reducers'

DEFAULT_ENDPOINT_TYPE = 'rest'

applyExtra = (actions, extra) ->
  actionsWithExtra = {}
  for actionName, action of actions
    do (action) ->
      actionsWithExtra[actionName] =  (args...) -> Object.assign({}, action(args...), extra)
  actionsWithExtra

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
        Object.assign({}, endpoint, settings)
      )

      api.actions[name] = applyExtra(api.actions[name], endpoint.extra) if endpoint.extra

      api.reducers[name] = reducers[type](name, endpoint.initialState, endpoint.reducer)
    else
      api.actions[name]  = actions[DEFAULT_ENDPOINT_TYPE](name, endpoint)
      api.reducers[name] = reducers[DEFAULT_ENDPOINT_TYPE](name)

  api

module.exports = trivialRedux

module.exports.actionTypesFor = require './action_types'