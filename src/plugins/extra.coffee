applyExtra = (actions, extra) ->
  actionsWithExtra = {}
  for actionName, action of actions
    do (action) ->
      actionsWithExtra[actionName] =  (args...) -> Object.assign({}, action(args...), extra)
  actionsWithExtra

module.exports = (name, endpoint, api) ->
  api.actions[name] = applyExtra(api.actions[name], endpoint.extra) if endpoint.extra