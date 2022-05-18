import urlFormat from '../utils/url_format'
import {TrivialReduxType} from '../types'

interface TypeActions<S> {
  reset: () => {type: string}
}

interface TypeAsyncActions {
  fetch: (idOrData: number | object, data: object) => {
    types: Array<string>
    meta: {
      fetch: {
        url: string
        params: object
      }
    }
  }
}

interface TypeAsyncActionsTypes<T> {
  fetch: () => T
}

type TypeRequests = TypeAsyncActions

interface TrivialReduxEndpointOptions<S> {
  initialState?: S
}

interface DefaultInitialState<D> {
  fetching: boolean
  lastUpdatedAt: number
  data: D
}

export default <M, S extends DefaultInitialState<M> = DefaultInitialState<M>>(
  options: TrivialReduxEndpointOptions<S> = {}
) : TrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeAsyncActionsTypes<M>>=> {
  const {initialState} = options
  return {
    name: 'test',
    initialState,
    options,
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
          case this.types.fetch.load:
            state.fetching = true;
            break;
          case this.types.fetch.success:
            state.lastUpdatedAt = new Date().getTime();
            state.data = action.payload;
            state.fetching = false;
            break;
          case this.types.fetch.failure:
            state.data = action.payload;
            state.fetching = false;
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

      return {
        fetch: function(idOrData: number | object, data: object) {
          var id;
          if (idOrData instanceof Object) {
            data = idOrData;
          } else {
            id = idOrData;
          }
          return {
            types: actionTypesFor('fetch', entityName),
            meta: {
              fetch: {
                url: format(id != null ? entityName + "/" + id : entityName),
                params: data
              }
            }
          };
        }
      }
    }
  }
}
