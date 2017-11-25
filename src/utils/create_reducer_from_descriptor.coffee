_ = require 'lodash'

module.exports = (descriptor, context) ->
  {actions, methods} = descriptor
  # Копируем методы в контекст
  if typeof methods is 'object'
    for name, method of methods
      methods[name] = method.bind(context)
      throw "[trivial-redux] #{name} is reserved word" if context[name]
      context[name] = method

  throw "[trivial-redux] Reducer descriptor must contains actions key." unless descriptor.actions

  return descriptor.actions if typeof descriptor.actions is 'function'

  throw "[trivial-redux] Actions must be a function or an object." unless typeof descriptor.actions is 'object'

  for name, action of actions
    type = typeof action
    throw "[trivial-redux] Action #{name} must be a function or an object" unless type in ['object', 'function'] 
    if type is 'object'
      for status, reducer of action
        unless typeof reducer is 'function'
          throw "[trivial-redux] The reducer for action #{name}.#{status} must be a function."

  (state, action) ->
    path = _ action.type
      # very very bad
      .replace("/PENDING", "/LOAD")
      .split("/")
      .map(_.lowerCase)
      .filter((el, i) -> i isnt 1)
    reducer = 
      _(
        [
          _.get(actions, path.join('.'))
          _.get(actions, path[0])
          _.get(actions, "#{path[0]}.default")
        ]
      ).find()

    reducer &&= reducer.bind(context)

    ensureReducer = _.get(actions, "#{path[0]}.ensure")
    ensureReducer &&= ensureReducer.bind(context)

    _(reducer?(state, action) || state)
      .thru((state) -> if ensureReducer? then ensureReducer(state, action) else state)
      .value()








