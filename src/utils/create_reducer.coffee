createReducerContext = require './create_reducer_context'

module.exports = (entityName, reducerFactory, initialState, customReducer = null, actions = null) ->
  reducer = reducerFactory(entityName, initialState || reducerFactory.defaultState)
  context = createReducerContext(entityName, actions, reducer) if actions
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return reducer unless customReducer?
  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState).bind(context)
