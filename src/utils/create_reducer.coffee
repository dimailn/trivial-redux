createReducerContext = require './create_reducer_context'
{produce} = require 'immer'


applyImmer = (reducer) -> (state, action) ->
  produce(state, (draftState) ->
    reducer(draftState, action)
  )

applyDecorators = (reducer, decorators, context) ->
   decorators.reduce(
      (reducer, decorator) ->
        reducer = decorator(reducer).bind(context)
        reducer = applyImmer(reducer) if decorator.immer
        reducer
      reducer
   )

module.exports = (entityName, reducerFactory, endpoint, allTypes) ->
  {initialState, reducer: customReducer, decorators, immer} = endpoint

  innerContext = createReducerContext(entityName, allTypes)
  reducer = reducerFactory(entityName, initialState || reducerFactory.defaultState)
  reducer = reducer.bind(innerContext)
  # if custom reducer doesn't use immer we should apply immer to provide plain objects

  reducerWithImmer = applyImmer(reducer)
  context = createReducerContext(entityName, allTypes, reducerWithImmer)

  # return standard reducer if we have no custom reducer
  return applyDecorators(reducerWithImmer, decorators, context) unless customReducer?

  reducer = applyImmer(reducer) unless immer

  context = createReducerContext(entityName, allTypes, reducer)

  customReducer = customReducer.bind(context)

  # Apply decorators
  customReducer = applyDecorators(customReducer, decorators, context)

  customReducer = applyImmer(customReducer) if immer

  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState)
