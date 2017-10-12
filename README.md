# trivial-redux 
[![Build Status](https://travis-ci.org/dimailn/trivial-redux.svg?branch=master)](https://travis-ci.org/dimailn/trivial-redux)


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
- [The endpoint state structure](#the-endpoint-state-structure)
- [Actions description](#actions-description)
- [Configuration object](#configuration-object)
  

## Installation
Install package via npm

```npm install trivial-redux --save```

or yarn

```yarn add trivial-redux```

## Getting started
trivialRedux is the fabric for creating api object:

```javascript
import trivialRedux from 'trivial-redux'

const api = trivialRedux(
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

```javascript
store.dispatch(api.actions.todos.index())
```

The endpoint configuration may be more detailed, then we use object instead of url string.
For example, Trivial Redux contains two types of endpoints - rest and fetch(more simple). 
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
