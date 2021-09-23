trivialRedux = {defaultStates} = require '../../src/index'

AuthDecorator = (reducer) -> (state, action) ->
  if action.type == @types.index.failure
    Object.assign({}, reducer(state, action), noAccess: true)
  else
    reducer(state, action)

api = null

describe 'Decorators for reducer', ->
  describe "endpoint with custom reducer", ->
    beforeEach ->
      api = trivialRedux(
        todos:
          entry: '~todos'
          decorators: [AuthDecorator]
          reducer: (state, action) ->
            if action.type == @types.index.failure
              Object.assign({}, @reducer(state, action), anotherData: 'Some error')
            else
              @reducer(state, action)
      )

    test 'simple auth decorator', ->
      state = Object.assign({}, defaultStates.rest)
      state = api.reducers.todos(state, type: api.types.todos.index.failure)

      expect(state.noAccess).toBe true
      expect(state.anotherData).toBe 'Some error'
      expect(state.fetching).toBe false


    test 'process initial', ->
      state = Object.assign({}, defaultStates.rest)
      state = api.reducers.todos(undefined, type: "INIT")

      expect(state.fetching).toBe false

  describe "endpoint without customer reducer", ->
    beforeEach ->
      api = trivialRedux(
        todos:
          entry: '~todos'
          decorators: [AuthDecorator]
      )

    test 'simple auth decorator', ->
      state = Object.assign({}, defaultStates.rest)
      state = api.reducers.todos(state, type: api.types.todos.index.failure)

      expect(state.noAccess).toBe true
      expect(state.fetching).toBe false

    test 'process initial', ->
      state = Object.assign({}, defaultStates.rest)
      state = api.reducers.todos(undefined, type: "INIT")

      expect(state.fetching).toBe false

  describe "decorator with immer", ->
    beforeEach ->
      AuthDecorator = (reducer) -> (state, action) ->
        if action.type == @types.index.failure
          reducer(state, action)
          state.noAccess = true
          return
        else
          reducer(state, action)

      AuthDecorator.immer = true

      api = trivialRedux(
        todos:
          entry: '~todos'
          decorators: [AuthDecorator]
      )

    test 'changes value', ->
      state = Object.assign({}, defaultStates.rest)
      state = api.reducers.todos(state, type: api.types.todos.index.failure)

      expect(state.noAccess).toBe true
      expect(state.fetching).toBe false

    test 'process initial', ->
      state = Object.assign({}, defaultStates.rest)
      state = api.reducers.todos(undefined, type: "INIT")

      expect(state.fetching).toBe false