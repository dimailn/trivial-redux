const {combineEndpoints, rest} = require( '../../src/index')


const restDefaultState = require('../../src/states/rest')

let api = combineEndpoints({
  todos: rest({
      entry: 'http://www.somesite.somedomain/todos'
  })
});


console.log(JSON.stringify(api))

const reducers = api.reducers
const types = api.types

const todos = [
  {
    title: 'One'
  }, {
    title: 'Two'
  }
];

describe('REST reducer', function() {
  test('index pending', function() {
    var state;
    state = Object.assign({}, restDefaultState);
    state = reducers.todos(state, {
      type: types.todos.index.load,
      payload: todos
    });
    return expect(state.fetching).toBe(true);
  });
  test('index success', function() {
    var state;
    state = Object.assign({}, restDefaultState);
    state = reducers.todos(state, {
      type: types.todos.index.success,
      payload: todos
    });
    expect(state.data.collection).toEqual(todos);
    expect(typeof state.lastUpdatedAt).toBe('number');
    return expect(state.fetching).toBe(false);
  });
  test('index failure', function() {
    var error, state;
    error = 'Some error';
    state = Object.assign({}, restDefaultState);
    state = reducers.todos(state, {
      type: types.todos.index.failure,
      response: error
    });
    expect(state.error).toBe(error);
    return expect(state.fetching).toBe(false);
  });
  test('show pending', function() {
    var state;
    state = Object.assign({}, restDefaultState);
    state = reducers.todos(state, {
      type: types.todos.show.load
    });
    return expect(state.fetching).toBe(true);
  });
  test('show success', function() {
    var state, todo;
    todo = {
      title: 'something to do'
    };
    state = Object.assign({}, restDefaultState);
    state = reducers.todos(state, {
      type: types.todos.show.success,
      payload: todo
    });
    expect(state.fetching).toBe(false);
    return expect(state.data.current).toEqual(todo);
  });
  test('show failure', function() {
    var error, state;
    error = "Some error";
    state = Object.assign({}, restDefaultState);
    state = reducers.todos(state, {
      type: types.todos.show.failure,
      response: error
    });
    expect(state.error).toBe(error);
    return expect(state.fetching).toBe(false);
  });
  test('reset without initial state', function() {
    var state;
    state = Object.assign({}, restDefaultState, {
      data: {
        current: {},
        collection: [{}]
      }
    });
    state = reducers.todos(state, {
      type: types.todos.reset
    });
    return expect(state).toEqual(restDefaultState);
  });
  test('reset with initial state', function() {
    var initialState, state;
    initialState = Object.assign({}, restDefaultState, {
      someProp: 10,
      someRefProp: [{}]
    });
    api = combineEndpoints({
      todos: rest({
        entry: 'http://www.somesite.somedomain/todos',
        initialState: initialState
      })
    });
    state = api.reducers.todos(Object.assign({}, initialState), {
      type: api.types.todos.reset
    });
    return expect(state).toEqual(initialState);
  });
  test('update success', function() {
    var newTitle, state;
    newTitle = "New title";
    state = Object.assign({}, restDefaultState, {
      data: Object.assign({}, restDefaultState.data)
    });
    state.data.collection = state.data.collection.concat([
      {
        title: 'Something',
        id: 5
      }
    ]);
    state = reducers.todos(state, {
      type: types.todos.update.success,
      payload: {
        id: 5,
        title: newTitle
      }
    });
    return expect(state.data.collection[0].title).toBe(newTitle);
  });
  test('nextPage pending', function() {
    var state;
    state = Object.assign({}, restDefaultState);
    state = reducers.todos(state, {
      type: types.todos.nextPage.load,
      meta: {
        page: 1
      }
    });
    return expect(state.fetching).toBe(true);
  });
  test('nextPage success', function() {
    var state;
    state = Object.assign({}, restDefaultState);
    state = reducers.todos(state, {
      type: types.todos.nextPage.success,
      meta: {
        page: 1
      },
      payload: todos
    });
    expect(state.fetching).toBe(false);
    expect(state.data.collection).toEqual(todos);
    return expect(state.nextPage).toBe(2);
  });
  test('nextPage success - second page', function() {
    var collection, otherTodos, state;
    state = Object.assign({}, restDefaultState);
    otherTodos = [
      {
        title: 'Onem more todo'
      }
    ];
    collection = todos.concat(otherTodos);
    state = reducers.todos(state, {
      type: types.todos.nextPage.success,
      payload: todos,
      meta: {
        page: 1
      }
    });
    state = reducers.todos(state, {
      type: types.todos.nextPage.success,
      payload: otherTodos,
      meta: {
        page: 2
      }
    });
    expect(state.data.collection).toEqual(collection);
    expect(state.nextPage).toBe(3);
    return expect(state.fetching).toBe(false);
  });
  test('nextPage failure', function() {
    var error, state;
    state = Object.assign({}, restDefaultState);
    error = "Some error";
    state = reducers.todos(state, {
      type: types.todos.nextPage.failure,
      response: error,
      meta: {
        page: 1
      }
    });
    expect(state.fetching).toBe(false);
    return expect(state.error).toBe(error);
  });
  test('some action', function() {
    var state;
    state = Object.assign({}, restDefaultState, {
      data: {
        current: {},
        collection: [
          {
            title: 'some todo'
          }
        ]
      }
    });
    return expect(reducers.todos(state, {
      type: 'SOME_ACTION_TYPE'
    })).toEqual(state);
  });
  return test('allTypes from custom REST reducer', function() {
    var reducer, state;
    reducer = jest.fn(function(state, action) {
      expect(this.allTypes).toBeDefined();
      expect(this.allTypes.comments).toBeDefined();
      expect(this.allTypes.todos).toBe(this.types);
      expect(this.allTypes.comments.index).toBeDefined();
      return expect(this.allTypes.comments).toBe(api.types.comments);
    });
    api = combineEndpoints({
      todos: rest({
        entry: 'http://www.somesite.somedomain/todos',
        reducer: reducer
      }),
      comments: rest({entry: 'http://www.somesite.somedomain/comments'})
    });
    state = Object.assign({}, restDefaultState);
    api.reducers.todos(state, api.actions.todos.index());
    return expect(reducer).toBeCalled();
  });
});
