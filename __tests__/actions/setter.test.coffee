trivialRedux   = require '../../src/index'
actionTypeFor  = require '../../src/action_type'

api = null

beforeEach ->
  api = trivialRedux(
    token:
      type: 'setter'
  )

describe 'Setter actions', ->
  test 'action set with data', ->
    action = api.actions.token.set('SOME_TOKEN')
    expect(action.payload).toBe 'SOME_TOKEN'
    expect(action.type).toBe actionTypeFor('set', 'token')
    expect(action.types).toBeUndefined()

  test 'reset action', ->
    action = api.actions.token.reset()
    expect(action.type).toBe actionTypeFor('reset', 'token')
    expect(action.payload).toBeUndefined()
    expect(action.types).toBeUndefined()