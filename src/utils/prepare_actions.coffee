module.exports = (actionCreators, types) ->
  decoratedActionCreators = {}

  Object.keys(actionCreators).forEach (name) ->
    actionCreator = actionCreators[name]
    type = types[name]

    decoratedActionCreators[name] = (args...) ->
      action = actionCreator(args...)

      unless typeof action is 'object'
        action = {}
        console.warn('[trivial-redux] Action creator in custom type must return an object')

      action.type = type unless action.type

      action

  decoratedActionCreators