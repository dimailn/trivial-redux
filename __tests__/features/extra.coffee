trivialRedux = require '../../src/index'

api = trivialRedux(
  todos:
    entry: 'todos'
    extra:
      meta:
        someKey: 'someValue'
)


describe 'Extra options', ->
  test 'extra options for endpoint', ->
    action = api.actions.todos.index()

    expect(action.types).toBeDefined()
    expect(action.meta).toBeDefined()
    expect(action.meta.fetch).toBeDefined()
    expect(action.meta.fetch.url).toBe 'todos.json'
    expect(action.meta.someKey).toBe 'someValue'