import urlFormat from '../utils/url_format'
import {TrivialReduxType} from '../types'

interface TypeActions<S> {
  reset: () => {type: string}
}

interface TypeAsyncActions {
  execute: (data: object, options: object) => {
    types: Array<string>
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

export default <M, S extends DefaultInitialState<M> = DefaultInitialState<M>>(
  {
    initialState
  }: TrivialReduxEndpointOptions<S> = {}
) : TrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeAsyncActionsTypes<M>>=> {
  return {
    name: 'test',
    initialState,
    actions(entityName, endpoint){
      return {
        reset: function() {
          return {
            type: actionTypeFor('reset', entityName)
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
            types: actionTypesFor('execute', entityName),
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
