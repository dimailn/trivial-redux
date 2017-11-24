createReducerContext = require './create_reducer_context'


module.exports = (entityName, reducerFactory, initialState, customReducer = null, actions = null, decorators, allTypes = null) ->
  reducer = reducerFactory(entityName, initialState || reducerFactory.defaultState)
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return reducer unless customReducer?

  context = createReducerContext(entityName, actions, reducer)
  
  # Прикрепляем контекст
  customReducer = customReducer.bind(context)

  # Применяем декораторы
  customReducer = decorators.reduce(
    (reducer, decorator) -> decorator(reducer).bind(context)
    customReducer
  )

  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState)
