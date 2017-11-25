trivialRedux = require '../../src/index'

api = trivialRedux(
  todos: 'todos'
)

describe "Parse type", ->
  test "should work correct", ->
    expect(typeof api.parseType).toBe 'function'

    desc = api.parseType(api.types.todos.index.load)
    expect(desc.endpoint).toBe 'todos'
    expect(desc.action).toBe 'index'
    expect(desc.status).toBe 'PENDING'
