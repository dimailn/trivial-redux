createReducerContext = require './create_reducer_context'


module.exports = (entityName, reducerFactory, endpoint, allTypes) ->
  {initialState, reducer: customReducer, decorators} = endpoint

  innerContext = createReducerContext(entityName, allTypes)
  reducer = reducerFactory(entityName, initialState || reducerFactory.defaultState)
  reducer = reducer.bind(innerContext)
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return reducer unless customReducer?

  # Прикрепляем контекст
  context = createReducerContext(entityName, allTypes, reducer)
  customReducer = customReducer.bind(context)

  # Применяем декораторы
  customReducer = decorators.reduce(
    (reducer, decorator) -> decorator(reducer).bind(context)
    customReducer
  )

  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState)
