createReducerContext = require './create_reducer_context'

createReducerFromDescriptor = require './create_reducer_from_descriptor'

module.exports = (entityName, reducerFactory, endpoint, allTypes) ->
  {initialState, reducer: customReducer, decorators} = endpoint

  innerContext = createReducerContext(entityName, allTypes)
  reducer = reducerFactory(entityName, initialState || reducerFactory.defaultState)
  reducer = reducer.bind(innerContext)
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return reducer unless customReducer?

  context = createReducerContext(entityName, allTypes, reducer)

  # Прикрепляем контекст
  customReducer = 
    if typeof customReducer is 'object'
      createReducerFromDescriptor(customReducer, context).bind(context)
    else
      customReducer.bind(context)

  Object.freeze(context)

  # Применяем декораторы
  customReducer = decorators.reduce(
    (reducer, decorator) -> decorator(reducer).bind(context)
    customReducer
  )

  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState)
