createReducerContext = require '../utils/create_reducer_context'

module.exports = (entityName, reducerFactory, initialState, customReducer = null, actions) ->
  reducer = reducerFactory(entityName, initialState)
  context = createReducerContext(entityName, actions, reducer)
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return reducer unless customReducer?
  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState).bind(context)
