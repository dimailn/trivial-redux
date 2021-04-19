module.exports = (actionCreators, types) ->
  decoratedActionCreators = {}

  Object.keys(actionCreators).forEach (name) ->
    actionCreator = actionCreators[name]
    type = types[name]

    decoratedActionCreators[name] = (args...) ->
      action = actionCreator(args...)

      action.type = type unless action.type

      action

  decoratedActionCreators