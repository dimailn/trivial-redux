trivialRedux   = {defaultStates} = require '../../src/index'
actionTypesFor = require '../../src/action_types'
actionTypeFor  = require '../../src/action_type'
defaultState   = require '../../src/states/setter'
{cloneDeep}    = require 'lodash'

customSetter = {
  name: 'custom-setter'
  initialState: null
  reducer: (entityName, initialState) -> (state = initialState, action) ->
    (state = initialState, action) ->
      switch action.type
        when @types.set
          action.payload
        when @types.reset
          cloneDeep(initialState)
        else
          state
  actions: (entityName, endpoint, settings) ->
    set: (data) ->
      type: actionTypeFor('set', entityName)
      payload: data

    reset: ->
      type: actionTypeFor('reset', entityName)
}

endpoints = {
  token:
    type: 'custom-setter'
}


api = trivialRedux(endpoints,
  types: [
    customSetter
  ]
)

reducer = api.reducers.token

describe 'CUSTOM SETTER reducer', ->
  test 'set', ->
    state = reducer(defaultStates.setter, api.actions.token.set('SOME_TOKEN'))
    expect(state).toBe 'SOME_TOKEN'

  test 'reset', ->
    state = reducer('SOME_TOKEN', api.actions.token.reset())
    expect(state).toBe defaultStates.setter

  test 'unknown action', ->
    state = reducer('SOME_TOKEN', type: 'SOME_ACTION_TYPE')
    expect(state).toBe 'SOME_TOKEN'


