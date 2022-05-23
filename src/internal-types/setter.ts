import {InternalTrivialReduxType, TrivialReduxEndpointOptions} from '../types'
import actionTypeFor from '../action_type'
import defaultState from '../states/setter'
import cloneDeep from 'lodash.clonedeep'
import createType from '../create-type'

type TypeActions<S> = {
  set: (value: S) => {payload: S, type: string}
  reset: () => {type: string}
}

type TypeAsyncActions = {
}

interface TypeAsyncActionsTypes<T> {
}



const type = <S>(
  options: TrivialReduxEndpointOptions<S, TypeActions<S>, TypeAsyncActions> = {}
) : InternalTrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeAsyncActionsTypes<void>>=> {
  return {
    name: 'test',
    options,
    actions(entityName){
      return {
        set(value: S){
          return {
            type: actionTypeFor('set', entityName),
            payload: value
          }
        },
        reset(){
          return {
            type: actionTypeFor('reset', entityName)
          }
        }
      }
    },
    reducer(entityName, initialState){
      return function (state, action) {

        if (state == null) {
          state = initialState;
        }
        switch (action.type) {
          case this.types.set:
            return action.payload;
          case this.types.reset:
            return initialState ? cloneDeep(initialState) : initialState
          default:
            return state
        }
      }
    },
    asyncActions(){
      return {}
    }
  }
}

export default createType(type, defaultState)