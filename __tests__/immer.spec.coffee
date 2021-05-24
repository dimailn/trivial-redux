trivialRedux  = {defaultStates} = require '../src/index'
actionTypesFor = require '../src/action_types'
actionTypeFor  = require '../src/action_type'

api = trivialRedux(
  todos:
    entry:'http://www.somesite.somedomain/todos'
    type: 'rest'
    immer: true
)

describe 'Immer mode', ->
  test "we ignore return value", ->
    state = Object.assign({}, defaultStates.rest)
    state = api.reducers.todos(state, type: api.types.todos.index.load, payload: [])
    expect(state.fetching).toBe false

  test "mutation produces new object", ->
    api = trivialRedux(
      todos:
        entry:'http://www.somesite.somedomain/todos'
        type: 'rest'
        immer: true
        reducer: (state, action) ->
          switch action.type
            when @types.index.load
              state.fetching = true
    )


    state = Object.assign({}, defaultStates.rest)
    state = api.reducers.todos(state, type: api.types.todos.index.load, payload: [])
    expect(state.fetching).toBe true