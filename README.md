# trivial-redux
Trivial Redux is the library for fast creating API layer that gives you trivial CRUD from the box.
It generates the actions and the reducers for standard REST queries. 
The reducers are easy expandable through the creating your own reducer that has convenient interface for access to 
the generated reducer, action types and the default state.

Trivial Redux was creating for generating only the part of the store structure(api entities, generally).
There are some tasks that don't fit the pattern and it is easier to solve them without this library.

trivialRedux is the fabric for creating api object:

```
trivialRedux = require 'trivial-redux'
api = trivialRedux(
  todos: 'http://some_site.com/todos',
  comments: 'http://some_site.com/posts'
)
```

We got the api object that contains:
* reducers - the object with reducers for todos and comments
* actions - the object contains the objects for todos and comments
contains action creators for standard rest queries + reset action for clearing the collection in the store
* types - action types for our entities

So, then we can do something like this:

```
store.dispatch(api.actions.todos.index())
```

The endpoint configuration may be more detailed, then we use object instead of url string.
For example, Trivial Redux contains two types of endpoints - rest and fetch(more simple). 
All endpoints are considered as rest by default, but it can be changed:

```
trivialRedux(
  todos: {
    url: '...',
    type: 'fetch'
  }
)
```

All options for configuration object you may see below.

# Reducers override
You can define your own reducer in the configuration object. It will have access to the standard trivial-redux reducer through this.reducer and types through this.types.

Note: *this* in reducer is the immutable context for more convenient pass of useful data from trivial-redux to your reducer.
You can't use it to save any your state.
```
trivialRedux(
  todos: {
    url: '...',
    reducer: function(state, action){
      switch(action.type){
        case this.types.index.success:
          // We can do some custom logic here
          // and generate state by our result and the stanard reducer result
          return {...someResult, this.reducer(state, action) }
        case this.types.destroy:
          // or we can not use the standard reducer
          // do something
          // return something
        case SOME_ACTION_TYPE:
          // or catch any other action types
          return null
        default:
          return this.reducer(state, action)
      }
    }
  }
)
```

## The endpoint state structure
### REST
```
{
  lastUpdatedAt: null,
  data: {
    collection: null,
    current: null,
    oldCurrent: null
  },
  fetching: false
}
```

* lastUpdatedAt - the timestamp for last update
* collection - the array of entities
* current - the property for keeping show action result
* oldCurrent - the property for keeping old current version for optimistic updates(not using now)
* fetching - the flag of fetching state

### Fetch
```
{
  lastUpdatedAt: null,
  data: null,
  fetching: false
}
```

## Actions description
### REST
#### index(params)
* params - url params for query

#### show(id)
* id - entity id

#### create(data)
* data - data for creating new entity

#### update(id, data)
* id - entity id for update
* data - changed entity data

#### destroy(id)
* id - entity id for destroy

#### nextPage(params)
Loads next page of entity collection and append it to state(for huge collections, instead of index)

* params - url params for filtering

#### reset()
Clears data.collection

### Fetch
#### fetch(idOrParams, params)

#### reset()
