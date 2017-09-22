trivialRedux  = {defaultStates} = require '../../src/index'

api = trivialRedux(
  todos:
    entry: 'http://www.somesite.somedomain/todos'
    type: 'fetch'
)

{reducers, types} = api

describe 'fetch reducer', ->
  test 'fetch pending', ->
    state = Object.assign({}, defaultStates.fetch)
    state = reducers.todos(state, type: types.todos.fetch.load)

    expect(state.fetching).toBe true

  test 'fetch success', ->
    data = {
      someData: 'Something',
      another: []
    }
    state = Object.assign({}, defaultStates.fetch)
    state = reducers.todos(state, type: types.todos.fetch.success, payload: data)

    expect(state.data).toEqual data
    expect(state.fetching).toBe false
    expect(typeof state.lastUpdatedAt).toBe 'number'

  test 'fetch failure', ->
    error = 'error'
    state = Object.assign({}, defaultStates.fetch)
    state = reducers.todos(state, type: types.todos.fetch.failure, payload: error)

    expect(state.fetching).toBe false
    expect(state.data).toBe error

  test 'some action', ->
    data = {
      someData: 'Something',
      another: []
    }
    state = Object.assign({}, defaultStates.fetch, data: data)

    expect(reducers.todos(state, type: 'SOME_ACTION_TYPE')).toEqual state