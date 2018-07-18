trivialRedux = require '../../src/index'

api = trivialRedux(
  todos: 'todos'
)

describe "Requests", ->
  test "should be", ->
    expect(typeof api.requests).toBe 'object'
    expect(typeof api.requests.todos.index).toBe 'function'


  test "plain action", ->
    action = api.requests.todos.index()

    expect(action.isRequest).toBe true
    expect(action.types).toEqual api.typesFor('index', 'todos')

  test "function action", ->
    action = api.requests.todos.nextPage()

    dispatch = jest.fn (action) ->
      expect(action.isRequest).toBe true
      expect(action.types).toEqual api.typesFor('nextPage', 'todos')

    getState = -> todos: api.reducers.todos(undefined, type: 'init')

    action(dispatch, getState)

    expect(dispatch).toBeCalled()



