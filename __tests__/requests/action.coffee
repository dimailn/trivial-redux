trivialRedux   = require '../../src/index'
actionTypesFor = require '../../src/action_types'
actionTypeFor  = require '../../src/action_type'

api = trivialRedux(
  todos:
    entry:'http://www.somesite.somedomain/todos'
    type: 'action'
)

describe 'Fetch actions', ->
  test 'execute action', ->
    action = {meta: {fetch}, types} = api.requests.todos.execute(test: 1)

    expect(types).toEqual actionTypesFor('execute', 'todos')
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'
    expect(fetch.params).toBeUndefined()
    expect(fetch.data).toEqual(test: 1)
    expect(Object.keys(fetch).length).toBe 3
    expect(action.isRequest).toBe true