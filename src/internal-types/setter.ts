import {TrivialReduxType} from '../types'
import actionTypeFor from '../action_type'
import defaultState from '../states/setter'
import cloneDeep from 'lodash.clonedeep'
import createType from '../create-type'
interface TypeActions<S> {
  set: (value: S) => {payload: S, type: string}
  reset: () => {type: string}
}

interface TypeAsyncActions {
}

interface TypeAsyncActionsTypes<T> {
}

interface TypeRequests {
}

interface TrivialReduxEndpointOptions<S> {
  initialState?: S
}

const type = <S>(
  options: TrivialReduxEndpointOptions<S> = {}
) : TrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeAsyncActionsTypes<void>>=> {
  let {initialState} = options

  return {
    name: 'test',
    initialState,
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