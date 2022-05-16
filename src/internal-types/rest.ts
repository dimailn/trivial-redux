import urlFormat from '../utils/url_format'
import {TrivialReduxType} from '../types'

interface TypeActions<S> {
  reset: () => {type: string}
}

interface TypeAsyncActions {
  index: (params) => {
    types: Array<string>
    meta: {
      fetch: {
        url: string
        params: any
      }
    }
  }
  show: (id: number | string) => {
    types: Array<string>
    meta: {
      fetch: {
        url: string
      }
    }
  }
  create: (data) => {
    types: Array<string>,
    meta: {
      fetch: {
        url: string
        data: any
        method: "POST"
      }
    }
  }
  update: (id: number | string, data) => {
    types: Array<string>,
    meta: {
      fetch: {
        url: string
        method: "PUT"
        data: any
      }
    }
  }
  destroy: (id: number | string) => {
    types: Array<string>
    meta: {
      fetch: {
        url: string
        method: "DELETE"
      }
    }
  }
  nextPage: (params) => (dispatch, getState) => {
    types: Array<string>
    meta: {
      fetch: {
        url: string,
        params: any
      },
      page: number
    }
  }
}

interface TypeAsyncActionsTypes<T> {
  index: () => Array<T>
  show: () => T
  update: () => T
  destroy: () => T
  nextPage: () => Array<T>
}

type TypeRequests = TypeAsyncActions

interface TrivialReduxEndpointOptions<S> {
  initialState?: S
}

interface DefaultInitialState<D> {
  fetching: boolean
  lastUpdatedAt: number
  error: any
  nextPage: number
  data: {
    collection: Array<D>
    current?: D
    oldCurrent?: D
  }
}

const handleNextPage = function(state, action, types) {
  switch (action.type) {
    case types.load:
      return state.fetching = true;
    case types.success:
      state.fetching = false;
      state.nextPage = state.nextPage ? state.nextPage + 1 : 2;
      return state.data.collection = state.data.collection.concat(action.payload);
    case types.failure:
      state.fetching = false;
      return state.error = action.response;
  }
};

export default <M extends {id: number | string}, S extends DefaultInitialState<M> = DefaultInitialState<M>>(
  entityName: string,
  {
    initialState
  }: TrivialReduxEndpointOptions<S> = {}
) : TrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeRequests, TypeAsyncActionsTypes<M>>=> {
  return {
    name: 'test',
    initialState,
    actions(entityName){
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
          case this.types.index.load:
            state.fetching = true;
            break;
          case this.types.index.success:
            state.lastUpdatedAt = new Date().getTime();
            state.data.collection = action.payload;
            state.fetching = false;
            state.error = null;
            break;
          case this.types.index.failure:
            state.fetching = false;
            state.error = action.response;
            break;
          case this.types.show.load:
            state.fetching = true;
            break;
          case this.types.show.success:
            state.data.current = action.payload;
            state.fetching = false;
            break;
          case this.types.show.failure:
            state.fetching = false;
            state.error = action.response;
            break;
          case this.types.reset:
            Object.keys(initialState).forEach((function(_this) {
              return function(key) {
                return state[key] = initialState[key];
              };
            })(this));
            break;
          case this.types.nextPage.load:
          case this.types.nextPage.success:
          case this.types.nextPage.failure:
            if (action.meta.page === state.nextPage || (state.nextPage == null)) {
              handleNextPage.bind(this)(state, action, this.types.nextPage);
            }
            break;
          case this.types.update.success:
            state.fetching = false;
            state.data = {
              collection: state.data.collection.map(function(entity) {
                if (entity.id === action.payload.id) {
                  return action.payload;
                } else {
                  return entity;
                }
              }),
              oldCurrent: null,
              current: null
            };
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
        index: function(params) {
          return {
            types: actionTypesFor('index', entityName),
            meta: {
              fetch: {
                url: format(entry),
                params: params
              }
            }
          };
        },
        show: function(id) {
          return {
            types: actionTypesFor('show', entityName),
            meta: {
              fetch: {
                url: format(entry + "/" + id)
              }
            }
          };
        },
        create: function(data) {
          return {
            types: actionTypesFor('create', entityName),
            meta: {
              fetch: {
                url: format(entry),
                data: data,
                method: 'POST'
              }
            }
          };
        },
        update: function(id, data) {
          return {
            types: actionTypesFor('update', entityName),
            meta: {
              fetch: {
                url: format(entry + "/" + id),
                method: "PUT",
                data: data
              }
            }
          };
        },
        destroy: function(id) {
          return {
            types: actionTypesFor('destroy', entityName),
            meta: {
              fetch: {
                url: format(entry + "/" + id),
                method: "DELETE"
              }
            }
          };
        },
        reset: function() {
          return {
            type: actionTypeFor('reset', entityName)
          };
        },
        nextPage: function(params) {
          return function(dispatch, getState) {
            var nextPage;
            nextPage = getState()[entityName].nextPage;
            params = Object.assign({}, {
              page: nextPage || 1
            }, params);
            return dispatch({
              types: actionTypesFor('nextPage', entityName),
              meta: {
                fetch: {
                  url: format(entry),
                  params: params
                },
                page: params.page
              }
            })
          }
        }
      }
    }
  }
}
