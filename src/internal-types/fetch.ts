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

export default <M, S>(
  entityName: string,
  {
    initialState
  }: TrivialReduxEndpointOptions<S> = {}
) : TrivialReduxType<S, TypeActions<S>, TypeAsyncActions, TypeRequests, TypeAsyncActionsTypes<M>>=> {
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
                url: format(id != null ? endpoint + "/" + id : endpoint),
                params: data
              }
            }
          };
        }
      }
    },
    requests(){
      return {}
    }
  }
}
