createReducerContext = require './create_reducer_context'
{produce} = require 'immer'


applyImmer = (reducer) -> (state, action) ->
  produce(state, (draftState) ->
    reducer(draftState, action)
  )

module.exports = (entityName, reducerFactory, endpoint, allTypes) ->
  {initialState, reducer: customReducer, decorators, immer} = endpoint

  innerContext = createReducerContext(entityName, allTypes)
  reducer = reducerFactory(entityName, initialState || reducerFactory.defaultState)
  reducer = reducer.bind(innerContext)

  # return standard reducer if we have no custom reducer
  return applyImmer(reducer) unless customReducer?

  # if custom reducer doesn't use immer we should apply immer to provide plain objects
  reducer = applyImmer(reducer) unless immer

  # Attach context
  context = createReducerContext(entityName, allTypes, reducer)
  customReducer = customReducer.bind(context)

  # Apply decorators
  customReducer = decorators.reduce(
    (reducer, decorator) -> decorator(reducer).bind(context)
    customReducer
  )


  customReducer = applyImmer(customReducer) if immer

  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, reducer, initialState)
