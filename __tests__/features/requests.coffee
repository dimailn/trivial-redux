trivialRedux = require '../../src/index'

api = trivialRedux(
  todos: 'todos'
)

describe "Requests", ->
  test "should be", ->
    console.log api.requests
    expect(typeof api.requests).toBe 'object'
    expect(typeof api.requests.todos.index).toBe 'function'

    action = api.requests.todos.index()

    expect(action.isRequest).toBe true
    expect(action.types).toEqual api.typesFor('index', 'todos')

