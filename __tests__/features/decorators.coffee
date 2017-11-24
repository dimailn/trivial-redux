trivialRedux = {defaultStates} = require '../../src/index'

AuthDecorator = (reducer) -> (state, action) ->
  if @types.index.failure
    Object.assign(reducer(state, action), noAccess: true)
  else
    reducer(state, action)

api = trivialRedux(
  todos:
    entry: '~todos'
    decorators: [AuthDecorator]
    reducer: (state, action) ->
      if @types.index.failure
        Object.assign(this.reducer(state, action), anotherData: 'Some error')
      else
        @reducer(state, action)
)

describe 'Decorators for reducer', ->
  test 'simple auth decorator', ->
    state = Object.assign({}, defaultStates.rest)
    state = api.reducers.todos(state, type: api.types.todos.index.failure)

    expect(state.noAccess).toBe true
    expect(state.anotherData).toBe 'Some error'
    expect(state.fetching).toBe false