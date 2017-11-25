trivialRedux = {defaultStates} = require '../../src/index'

defaultDescriptor = {
  actions:
    index:
      load: (state, action) -> Object.assign({}, state, fetching: true)
      success: (state, action) ->
      failure: (state, action) ->
      # ensure: (state, action) -> state
    show:
      load: (state, action) ->
      default: (state, action) ->
    destroy: (state, action) ->
  multiplex:
    actions: ['update.success', 'update.failure']
    reducer: (state, action) ->
  methods:
    doSomething: (arg1) ->
}

createApi = (descriptor = defaultDescriptor) ->
  trivialRedux(
    todos:
      entry: 'someurl'
      reducer: descriptor
  ) 

todos = [
  {
    title: 'One'
  }
  {
    title: 'Two'
  }
]

describe "Reducer descriptor", ->

  test "should call 2nd level type reducer", ->
    api = createApi()
    state = Object.assign({}, defaultStates.rest)
    state = api.reducers.todos(state, type: api.types.todos.index.load, payload: todos)
    expect(state.fetching).toBe true

  test "should call top reducer and get access to method", ->
    api = trivialRedux(
      todos:
        entry: 'someentry'
        reducer:
          actions: (state, action) ->
            if @types.show.success
              Object.assign({}, state, counterValue: @getCounter())
            else 
              state
          methods:
            getCounter: -> 5
    )

    state = Object.assign({}, defaultStates.rest)
    state = api.reducers.todos(state, type: api.types.todos.show.success, payload: todos)
    expect(state.counterValue).toBe 5

