import urlFormat from '../utils/url_format'
import {InternalTrivialReduxType, TrivialReduxEndpointOptions} from '../types'
import actionTypesFor from '../action_types'
import actionTypeFor from '../action_type'
import createType from '../create-type'
import {fetch as  defaultState} from '../states'
import {AxiosResponse} from 'axios'

type TypeActions<S> = {
  reset: () => {}
}

type TypeAsyncActions = {
  fetch: (idOrData?: number | object, data?: object) => {
    meta: {
      fetch: {
        url: string
        params: object
      }
    }
  }
}

interface TypeAsyncActionsTypes<T> {
  fetch: () => AxiosResponse<T>
}

interface DefaultInitialState<D> {
  fetching: boolean
  lastUpdatedAt: number
  data: D
}

const type = <M, S extends DefaultInitialState<M> = DefaultInitialState<M>>(
  options: TrivialReduxEndpointOptions<S, TypeActions<S>, TypeAsyncActions> = {}
) : InternalTrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeAsyncActionsTypes<M>>=> {
  return {
    name: 'test',
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
      // @ts-ignore
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

      const {entry} = options

      return {
        fetch: function(idOrData: number | object, data: object) {
          var id;
          if (idOrData instanceof Object) {
            data = idOrData;
          } else {
            id = idOrData;
          }
          return {
            meta: {
              fetch: {
                url: format(id != null ? entry + "/" + id : entry),
                params: data
              }
            }
          };
        }
      }
    }
  }
}

export default createType(type, defaultState)