trivialRedux  = {defaultStates} = require '../../src/index'

api = trivialRedux(
  token:
    type: 'setter'
)

reducer = api.reducers.token

describe 'SETTER reducer', ->
  test 'set', ->
    state = reducer(defaultStates.setter, api.actions.token.set('SOME_TOKEN'))
    expect(state).toBe 'SOME_TOKEN'

  test 'reset', ->
    state = reducer('SOME_TOKEN', api.actions.token.reset())
    expect(state).toBe defaultStates.setter

  test 'unknown action', ->
    state = reducer('SOME_TOKEN', type: 'SOME_ACTION_TYPE')
    expect(state).toBe 'SOME_TOKEN'
