# trivial-redux 
[![Build Status](https://travis-ci.org/dimailn/trivial-redux.svg?branch=master)](https://travis-ci.org/dimailn/trivial-redux)
[![Coverage Status](https://coveralls.io/repos/github/dimailn/trivial-redux/badge.svg?branch=coveralls)](https://coveralls.io/github/dimailn/trivial-redux?branch=coveralls)

Trivial Redux is the library for fast creating API layer that gives you trivial CRUD from the box.
It generates actions and reducers for standard REST queries. 
The reducers are easy expandable through creating your own reducer that has convenient interface for access to 
the generated reducer, action types and the default state.

Trivial Redux was creating for generating only the part of the store structure(api entities, generally).
There are some tasks that don't fit the pattern and it is easier to solve them without this library.

## Table of contents
- [Installation](#installation)
- [Getting started](#getting-started)
- [Recommended file structure](#recommended-file-structure)
- [Reducers override](#reducers-override)
- [Decorators](#decorators)
- [The endpoint state structure](#the-endpoint-state-structure)
- [Actions description](#actions-description)
- [Configuration object](#configuration-object)
- [Custom async types generator](#custom-async-types-generator)
- [Custom types](#custom-types)
- [Immutability](#immutability)
- [Roadmap](#roadmap)
  

## Installation
Install packages via npm

```npm install trivial-redux trivial-redux-middleware --save```

or yarn

```yarn add trivial-redux trivial-redux-middleware```

During store initialization pass the middleware and generated reducers

```javascript
import {createStore, combineReducers, applyMiddleware} from 'redux'
import trivialRedux from 'trivial-redux'
import trivialReduxMiddleware from 'trivial-redux-middleware'
import endpoints from './endpoints'
import reducers from './modules'

const api = trivialRedux(endpoints)
const rootReducer = combineReducers({...reducers, ...api.reducers })
const middlewares = [
  trivialReduxMiddleware
]

export default createStore(rootReducer, applyMiddleware(...middlewares))
```

## Getting started
trivialRedux is the fabric for creating api object:

```javascript
import trivialRedux from 'trivial-redux'

const api = trivialRedux(
  {
    todos: 'http://some_site.com/todos',
    comments: 'http://some_site.com/posts'
  }
)
```

We got the api object that contains:
* reducers - the object with reducers for todos and comments
* actions - the object contains the objects for todos and comments
contains action creators for standard rest queries + reset action for clearing the collection in the store
* types - action types for our entities

So, then we can do something like this:

```javascript
store.dispatch(api.actions.todos.index())
```

The endpoint configuration may be more detailed, then we use object instead of url string.
For example, Trivial Redux contains some types of endpoints - rest, fetch and setter. 
All endpoints are considered as rest by default, but it can be changed:

```javascript
trivialRedux(
  todos: {
    entry: '...',
    type: 'fetch'
  }
)
```

All options for configuration object you may see below.

## Recommended file structure
We recommend to keep complex endpoint in separate files:
```
|-- api.js
|-- endpoints
    |-- todos.js
    |-- comments.js
```

And aggregate them in main entry point
 ```javascript
 // api.js
 import trivialRedux from 'trivial-redux'
 
 import todos from './endpoints/todos'
 import comments from './endpoints/comments'
 
 export default trivialRedux(
  {
    todos,
    comments
  }
 )
```
## Reducers override
You can define your own reducer in the configuration object. It will have access to the standard trivial-redux reducer through this.reducer and types through this.types.

Note: *this* in reducer is immutable context for more convenient pass of useful data from trivial-redux to your reducer.
You can't use it to save any your state.
```javascript
trivialRedux(
  todos: {
    entry: '...',
    reducer: function(state, action){
      switch(action.type){
        case this.types.index.success:
          // We can do some custom logic here
          // and generate state by our result and the stanard reducer result
          return {...someResult, this.reducer(state, action) }
        case this.types.destroy.failure:
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
## Decorators

Sometimes you have common logic for the reducers(pagination, for example). In this case you can write this logic once in reducer decorator and use it wherever you need it. 

```javascript

// define you decorator
const PaginationDecorator = function(reducer){
  return function(state, action){
    // here you have access to this.types, etc
    switch(action.type){
      case this.types.index:
        return { ...reducer(state, action), ...awesomePagination }
       default:
        return reducer(state, action)
    }
  }
}

// and use it in endpoint config

trivialRedux(
  {
    todos: {
        entry: '~todos',
        decorators: [PaginationDecorator]
    }
  }
)

```

## The endpoint state structure
### REST
```javascript
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
```javascript
{
  lastUpdatedAt: null,
  data: null,
  fetching: false
}
```

### Setter
```javascript
null
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
Loads next page of entity collection and append it to state(for huge collections, instead of index). Redux-thunk required.

* params - url params for filtering

#### reset()
Clears data.collection

### Fetch
#### fetch(idOrParams, params)

#### reset()

### Setter

#### set(data)

#### reset()

## Configuration object
You may pass the global configuration object as second argument of trivialRedux fabric. The endpoints's settings are override global.

### Configuration object properties
#### entry
Entry url for the endpoint.
#### type
The type of endpoint, rest or fetch.
#### skipFormat
The option for skip .json postfix that concatenates by default.
#### reducer
The custom reducer for your own logic. If it is null, the reducer for the current endpoint will be omitted.
#### initialState
The initial state for the reducer
#### decorators
The array of reducer decorators. Decorator is a function which takes reducer and wraps it with its own custom logic.
#### host
The host for url prefix

## Custom async types generator

There are some helpers in trivial redux for getting types: 

* ```api.typesFor```
* reducer's ```this.typesFor```
* reducer's ```this.types```
* reducer's ```this.allTypes```

These helpers are bound to trivial-redux instance settings. There is also the helper ```actionTypesFor``` from trivial-redux package. This helper is not bound to trivial-redux instance settings and may be incompatible with with the above helpers. 


## Custom types

Besides the built-in types you may use your own types. Define you type like below:

```javascript

export default {
  name: 'custom-setter',
  initialState: null,
  // all reducers of types works on immer
  // It means you should mutate state here or return new state(not both)
  reducer(entityName, initialState) {
    return function(state = initialState, action) {
      switch(action.type) {
        case this.types.set
          return action.payload
        case this.types.reset
          return cloneDeep(initialState)
        else
          return state
      }
    }
  },
  actions(entityName, endpoint, settings) {
    return {
      set(data) {
        return {payload: data}
      }
      reset(){
        return {}
      }
    }
  }
      
  asyncActions(entityName, endpoint, settings) {
    return {
      load() {
        return {
          meta: {
            fetch: {
              url: '...'
            }
          }
        }
      } 
  }
}

```

Action types will be generated based on action name and type(sync/async). You may also specify your type explicit.

After you may use your type in schema as following:

```javascript

export default trivialRedux(
  {
    todo:
      type: 'custom-setter'
  },
  {
    types: [
      CustomSetter
    ]
  }
)

```

## Immutability

Trivial redux uses Immer to provide immutable reducers. You may pass ```immer: true``` in global settings(or for current endpoint), and your reducers will work in immutable way, no other changes is needed.


## Roadmap
* Custom actions
* Aliases
* Extended decorators

