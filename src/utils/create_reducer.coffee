module.exports = (entity_name, reducerFactory, initialState, customReducer = null) ->
  reducer = reducerFactory(entity_name, initialState)
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return reducer unless customReducer?
  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState)
