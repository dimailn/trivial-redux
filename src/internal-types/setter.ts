import {TrivialReduxType} from '../types'

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

export default <S>(
  options: TrivialReduxEndpointOptions<S> = {}
) : TrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeAsyncActionsTypes<void>>=> {
  const {initialState} = options
  return {
    name: 'test',
    initialState,
    options,
    actions(entityName){
      return {
        set(value: S){
          return {
            type: actionTypeFor(entityName, 'set'),
            payload: value
          }
        },
        reset(){
          return {
            type: actionTypeFor(entityName, 'reset')
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
            return cloneDeep(initialState)
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