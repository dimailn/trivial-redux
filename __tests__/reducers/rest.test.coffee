trivialRedux  = {defaultStates} = require '../../src/index'

api = trivialRedux(
  todos: 'http://www.somesite.somedomain/todos'
)

{reducers, types} = api

todos = [
  {
    title: 'One'
  }
  {
    title: 'Two'
  }
]


describe 'REST reducer', ->
  test 'index pending', ->
    state = Object.assign({}, defaultStates.rest)
    state = reducers.todos(state, type: types.todos.index.load, payload: todos)
    expect(state.fetching).toBe true

  test 'index success', ->
    state = Object.assign({}, defaultStates.rest)
    state = reducers.todos(state, type: types.todos.index.success, payload: todos)

    expect(state.data.collection).toEqual todos
    expect(typeof state.lastUpdatedAt).toBe 'number'
    expect(state.fetching).toBe false

  test 'index failure', ->
    error = 'Some error'
    state = Object.assign({}, defaultStates.rest)
    state = reducers.todos(state, type: types.todos.index.failure, response: error)
    console.log types.todos.index.failure
    expect(state.error).toBe error
    expect(state.fetching).toBe false






