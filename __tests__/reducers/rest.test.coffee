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
    expect(state.error).toBe error
    expect(state.fetching).toBe false

  test 'show pending', ->
    state = Object.assign({}, defaultStates.rest)
    state = reducers.todos(state, type: types.todos.show.load)
    expect(state.fetching).toBe true

  test 'show success', ->
    todo = { title: 'something to do' }
    state = Object.assign({}, defaultStates.rest)
    state = reducers.todos(state, type: types.todos.show.success, payload: todo)

    expect(state.fetching).toBe false
    expect(state.data.current).toEqual todo

  test 'show failure', ->
    error = "Some error"
    state = Object.assign({}, defaultStates.rest)
    state = reducers.todos(state, type: types.todos.show.failure, response: error)

    expect(state.error).toBe error
    expect(state.fetching).toBe false

  test 'reset without initial state', ->
    state = Object.assign({}, defaultStates.rest, data: { current: {}, collection: [{}]})
    state = reducers.todos(state, type: types.todos.reset)

    expect(state).toEqual defaultStates.rest

  test 'reset with initial state', ->
    initialState = Object.assign({}, defaultStates.rest, someProp: 10, someRefProp: [{}])
    api = trivialRedux(
      todos:
        entry: 'http://www.somesite.somedomain/todos'
        initialState: initialState
    )

    state = api.reducers.todos(Object.assign({}, initialState), type: api.types.todos.reset)

    expect(state).toEqual initialState


  test 'update success', ->
    newTitle = "New title"
    state = Object.assign({}, defaultStates.rest, data: Object.assign({}, defaultStates.rest.data))
    state.data.collection = state.data.collection.concat [{ title: 'Something', id: 5 }]

    state = reducers.todos(state, type: types.todos.update.success, payload: { id: 5, title: newTitle})

    expect(state.data.collection[0].title).toBe newTitle

  test 'nextPage pending', ->
    state = Object.assign({}, defaultStates.rest)

    state = reducers.todos(state, type: types.todos.nextPage.load, meta: { page: 1})
    expect(state.fetching).toBe true

  test 'nextPage success', ->
    state = Object.assign({}, defaultStates.rest)

    state = reducers.todos(state, type: types.todos.nextPage.success, meta: { page: 1}, payload: todos)

    expect(state.fetching).toBe false
    expect(state.data.collection).toEqual todos
    expect(state.nextPage).toBe 2

  test 'nextPage success - second page', ->
    state = Object.assign({}, defaultStates.rest)
    otherTodos = [{title: 'Onem more todo'}]

    collection = todos.concat otherTodos

    state = reducers.todos(state, type: types.todos.nextPage.success, payload: todos, meta: { page: 1})
    state = reducers.todos(state, type: types.todos.nextPage.success, payload: otherTodos, meta: { page: 2})

    expect(state.data.collection).toEqual collection
    expect(state.nextPage).toBe 3
    expect(state.fetching).toBe false

  test 'nextPage failure', ->
    state = Object.assign({}, defaultStates.rest)
    error = "Some error"

    state = reducers.todos(state, type: types.todos.nextPage.failure, response: error, meta: { page: 1})

    expect(state.fetching).toBe false
    expect(state.error).toBe error

  test 'some action', ->
    state = Object.assign({}, defaultStates.rest, data: { current: {}, collection: [title: 'some todo']})

    expect(reducers.todos(state, type: 'SOME_ACTION_TYPE')).toEqual state









