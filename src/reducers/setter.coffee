actionTypesFor = require '../action_types'
actionTypeFor  = require '../action_type'
defaultState   = require '../states/setter'

{cloneDeep}   = require 'lodash'


createFetchReducerFor = (entity_name, initialState) ->
  (state = initialState, action) ->
    switch action.type
      when @types.set
        action.payload
      when @types.reset
        cloneDeep(initialState)
      else
        state

createFetchReducerFor.defaultState = defaultState

module.exports = createFetchReducerFor
