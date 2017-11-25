trivialRedux   = require '../../src/index'
actionTypesFor = require '../../src/action_types'
actionTypeFor  = require '../../src/action_type'

api = null

beforeEach ->
  api = trivialRedux(
    todos: 'http://www.somesite.somedomain/todos'
  )

describe 'REST actions', ->
  test 'index without params', ->
    action = api.actions.todos.index()
    {fetch} = action.meta
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'
    expect(fetch.params).toBeUndefined()
    expect(Object.keys(fetch).length).toBe 2
    expect(action.types).toEqual  actionTypesFor('index', 'todos')

  test 'index with params', ->
    action = api.actions.todos.index(search: 'something')
    {fetch} = action.meta
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'
    expect(fetch.params.search).toBe 'something'
    expect(Object.keys(fetch).length).toBe 2

  test 'index without params with own host', ->
    api = trivialRedux(
      {
        todos:
          entry: '~todos'
      }
      {
        host: 'http://www.somesite.somedomain/'
      }
    )

    {meta: {fetch}} = api.actions.todos.index()
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'

  test 'index without params with own host(simple endpoint description)', ->
    api = trivialRedux(
      {
        todos: '~todos'
      }
      {
        host: 'http://www.somesite.somedomain/'
      }
    )

    {meta: {fetch}} = api.actions.todos.index()
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'

  test 'show', ->
    action = api.actions.todos.show(5)
    {fetch} = action.meta
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos/5.json'
    expect(Object.keys(fetch).length).toBe 1
    expect(action.types).toEqual  actionTypesFor('show', 'todos')

  test 'create', ->
    data = title: 'one more thing'

    action = api.actions.todos.create(data)
    {fetch} = action.meta

    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'
    expect(fetch.method).toBe 'POST'
    expect(fetch.data).toBe data
    expect(action.types).toEqual  actionTypesFor('create', 'todos')

  test 'update', ->
    data = title: 'one more thing'
    {meta: {fetch}, types} = api.actions.todos.update(5, data)
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos/5.json'
    expect(fetch.method).toBe 'PUT'
    expect(fetch.data).toBe data
    expect(types).toEqual  actionTypesFor('update', 'todos')

  test 'destroy', ->
    {meta: {fetch}, types} = api.actions.todos.destroy(5)
    expect(fetch.url).toBe 'http://www.somesite.somedomain/todos/5.json'
    expect(fetch.method).toBe 'DELETE'
    expect(types).toEqual  actionTypesFor('destroy', 'todos')

  test 'reset', ->
    expect(api.actions.todos.reset().type).toBe actionTypeFor('reset', 'todos')

  test 'nextPage', ->
    getState = ->
      todos:
        nextPage: 2

    dispatch = (action) ->
      {meta: {fetch}} = action
      expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'
      expect(fetch.params).toEqual {page: 2}

    dispatch = jest.fn dispatch


    fAction = api.actions.todos.nextPage()
    fAction(dispatch, getState)

    expect(dispatch).toHaveBeenCalled()

  test 'nextPage with extra', ->
    api = trivialRedux(
      todos:
        entry: 'http://www.somesite.somedomain/todos'
        extra:
          meta:
            skipSome: true
    )

    getState = ->
      todos:
        nextPage: 2

    dispatch = (action) ->
      {meta: {fetch}} = action
      expect(fetch.url).toBe 'http://www.somesite.somedomain/todos.json'
      expect(fetch.params).toEqual {page: 2}
      expect(action.meta.skipSome).toBe true

    dispatch = jest.fn dispatch

    fAction = api.actions.todos.nextPage()
    fAction(dispatch, getState)

    expect(dispatch).toHaveBeenCalled()

