var api, defaultStates, reducers, ref, trivialRedux, types;

trivialRedux = (ref = require('../../src/index'), defaultStates = ref.defaultStates, ref);

api = trivialRedux({
  todos: {
    entry: 'http://www.somesite.somedomain/todos',
    type: 'fetch'
  }
});

reducers = api.reducers, types = api.types;

describe('fetch reducer', function() {
  test('fetch pending', function() {
    var state;
    state = Object.assign({}, defaultStates.fetch);
    state = reducers.todos(state, {
      type: types.todos.fetch.load
    });
    return expect(state.fetching).toBe(true);
  });
  test('fetch success', function() {
    var data, state;
    data = {
      someData: 'Something',
      another: []
    };
    state = Object.assign({}, defaultStates.fetch);
    state = reducers.todos(state, {
      type: types.todos.fetch.success,
      payload: data
    });
    expect(state.data).toEqual(data);
    expect(state.fetching).toBe(false);
    return expect(typeof state.lastUpdatedAt).toBe('number');
  });
  test('fetch failure', function() {
    var error, state;
    error = 'error';
    state = Object.assign({}, defaultStates.fetch);
    state = reducers.todos(state, {
      type: types.todos.fetch.failure,
      payload: error
    });
    expect(state.fetching).toBe(false);
    return expect(state.data).toBe(error);
  });
  return test('some action', function() {
    var data, state;
    data = {
      someData: 'Something',
      another: []
    };
    state = Object.assign({}, defaultStates.fetch, {
      data: data
    });
    return expect(reducers.todos(state, {
      type: 'SOME_ACTION_TYPE'
    })).toEqual(state);
  });
});
