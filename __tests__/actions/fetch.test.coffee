trivialRedux   = require '../../src/index'
actionTypesFor = require '../../src/action_types'
actionTypeFor  = require '../../src/action_type'

api = trivialRedux(
  todos:
    entry:'http://www.somesite.somedomain/todos'
    type: 'fetch'
)

describe 'Fetch actions', ->
  test 'fetch', ->
    {meta: {fetch}, types} = api.actions.todos.fetch()
    expect(types).toEqual actionTypesFor('fetch', 'todos')
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'
    expect(fetch.params).toBeUndefined()
    expect(Object.keys(fetch).length).toBe 2

  test 'fetch with id', ->
    {meta: {fetch}, types} = api.actions.todos.fetch(5)
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos/5.json'
    expect(fetch.params).toBeUndefined()
    expect(Object.keys(fetch).length).toBe 2

  test 'fetch with data', ->
    data = title: 'one more thing'
    {meta: {fetch}, types} = api.actions.todos.fetch(data)
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'
    expect(fetch.params).toEqual data
    expect(Object.keys(fetch).length).toBe 2

  test 'fetch with id and data', ->
    data = search: 'something'
    {meta: {fetch}, types} = api.actions.todos.fetch(5, data)
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos/5.json'
    expect(fetch.params).toEqual data
    expect(Object.keys(fetch).length).toBe 2

  test 'fetch with skipFormat', ->
    api = trivialRedux(
      todos:
        entry:'http://www.somesite.somedomain/todos'
        type: 'fetch'
        skipFormat: true
    )
    {meta: {fetch}, types} = api.actions.todos.fetch()
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos'
    expect(fetch.params).toBeUndefined()
    expect(Object.keys(fetch).length).toBe 2

  test 'reset', ->
    expect(api.actions.todos.reset().type).toBe actionTypeFor('reset', 'todos')
