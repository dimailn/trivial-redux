module.exports = (entity_name, initialState, customReducer = null) ->
  crudReducer = createRestReducerFor(entity_name, initialState)
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return crudReducer unless customReducer?
  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, crudReducer, initialState)
