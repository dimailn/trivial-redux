trivialRedux  = {defaultStates} = require '../../src/index'

api = trivialRedux(
  todos:
    entry: 'http://www.somesite.somedomain/todos'
    type: 'action'
)

{reducers, types} = api

describe 'action reducer', ->
  test 'execute pending', ->
    state = Object.assign({}, defaultStates.action)
    state = reducers.todos(state, type: types.todos.execute.load)

    expect(state.pending).toBe true

  test 'execute success', ->
    data = {
      someData: 'Something',
      another: []
    }
    state = Object.assign({}, defaultStates.action)
    state = reducers.todos(state, type: types.todos.execute.success, payload: data)

    expect(state.data).toEqual data
    expect(state.pending).toBe false
    expect(typeof state.lastExecutedAt).toBe 'number'

  test 'execute failure', ->
    error = 'error'
    state = Object.assign({}, defaultStates.action)
    state = reducers.todos(state, type: types.todos.execute.failure, payload: error)

    expect(state.pending).toBe false
    expect(state.data).toBe error

  test 'some action', ->
    data = {
      someData: 'Something',
      another: []
    }
    state = Object.assign({}, defaultStates.action, data: data)

    expect(reducers.todos(state, type: 'SOME_ACTION_TYPE')).toEqual state
