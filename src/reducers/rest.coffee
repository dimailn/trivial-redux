actionTypesFor = require '../action_types'

defaultState =
  lastUpdatedAt: null
  data:
    collection: []
    current: null
    oldCurrent: null
  fetching: false

createRestReducerFor = (entity_name, initialState) ->
  indexTypes = actionTypesFor('index', entity_name)
  showTypes  = actionTypesFor('show', entity_name)
  (state = initialState, action) ->
    switch action.type
      # index
      when indexTypes.load
        Object.assign({}, state, fetching: true)
      when indexTypes.success
        lastUpdatedAt: new Date().getTime(), data: Object.assign({}, state.data, collection: action.payload), fetching: false
      when indexTypes.failure
        Object.assign({}, state, fetching: false)
      # show
      when showTypes.success
        Object.assign({}, state, data: Object.assign({}, state.data, current: action.payload))
      else
        state

module.exports.defaultState = defaultState

module.exports = (entity_name, initialState = defaultState, customReducer = null) ->
  crudReducer = createRestReducerFor(entity_name, initialState)
  # Если не задан кастомный редьюсер - возвращаем стандартный
  return crudReducer unless customReducer?
  # Иначе возвращаем обертку над кастомным редьюсером, передавая в него стандартный редьюсер
  (state = initialState, action) -> customReducer(state, action, crudReducer, initialState)
