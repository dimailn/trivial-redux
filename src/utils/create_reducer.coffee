createReducerContext = require './create_reducer_context'

module.exports = (entityName, reducerFactory, initialState, customReducer = null, actions = null, allTypes = null) ->
  reducer = reducerFactory(entityName, initialState || reducerFactory.defaultState)
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return reducer unless customReducer?

  # Прикрепляем контекст
  customReducer = customReducer.bind(createReducerContext(entityName, actions, reducer))
  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState)
