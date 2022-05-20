import urlFormat from '../utils/url_format'
import {InternalTrivialReduxType, AsyncActionTypes} from '../types'
import actionTypesFor from '../action_types'
import actionTypeFor from '../action_type'
import defaultState from '../states/action'
import createType from '../create-type'

type TypeActions<S> = {
  reset: () => {}
}

type TypeAsyncActions = {
  execute: (data: object, options: object) => {
    meta: {
      fetch: {
        url: string
        data: object
        method: string
      }
    }
  }
}

interface TypeAsyncActionsTypes<T> {
  execute: () => T
}

interface TrivialReduxEndpointOptions<S> {
  initialState?: S
}

interface DefaultInitialState<D> {
  pending: boolean
  lastExecutedAt: number
  data: D
}

const type = <M, S extends DefaultInitialState<M> = DefaultInitialState<M>>(
  options: TrivialReduxEndpointOptions<S> = {}
) : InternalTrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeAsyncActionsTypes<M>>=> {
  const {initialState} = options

  return {
    name: 'test',
    initialState,
    options,
    actions(entityName, endpoint){
      return {
        reset: function() {
          return {
          };
        }
      }
    },
    reducer(entityName, initialState){
      return function (state, action) {
        if (state == null) {
          state = initialState;
        }
        switch (action.type) {
          case this.types.execute.load:
            state.pending = true;
            break;
          case this.types.execute.success:
            state.lastExecutedAt = new Date().getTime();
            state.data = action.payload;
            state.pending = false;
            break;
          case this.types.execute.failure:
            state.data = action.payload;
            state.pending = false;
            break;
          case this.types.reset:
            Object.keys(initialState).forEach((function(_this) {
              return function(key) {
                return state[key] = initialState[key];
              };
            })(this));
            break;
          default:
            return state;
          }
      }
    },
    asyncActions(entityName, options){
      const format = urlFormat(options)
      const {entry} = options

      return {
        execute: function(data: object, options: object) {
          return {
            meta: {
              fetch: Object.assign({}, {
                url: format(entry),
                method: 'POST',
                data: data
              }, options)
            }
          };
        }
      }
    }
  }
}

export default createType(type, defaultState)