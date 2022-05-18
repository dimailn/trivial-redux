var api, reducers, types;


const {combineEndpoints, action} = require( '../../src/index')


const {default: actionDefaultState} = require('../../src/states/rest')


api = combineEndpoints({
  todos: action({
    entry: 'http://www.somesite.somedomain/todos'
})})

reducers = api.reducers, types = api.types;

describe('action reducer', function() {
  test('execute pending', function() {
    var state;
    state = Object.assign({}, actionDefaultState);
    state = reducers.todos(state, {
      type: types.todos.execute.load
    });
    return expect(state.pending).toBe(true);
  });
  test('execute success', function() {
    var data, state;
    data = {
      someData: 'Something',
      another: []
    };
    state = Object.assign({}, actionDefaultState);
    state = reducers.todos(state, {
      type: types.todos.execute.success,
      payload: data
    });
    expect(state.data).toEqual(data);
    expect(state.pending).toBe(false);
    return expect(typeof state.lastExecutedAt).toBe('number');
  });
  test('execute failure', function() {
    var error, state;
    error = 'error';
    state = Object.assign({}, actionDefaultState);
    state = reducers.todos(state, {
      type: types.todos.execute.failure,
      payload: error
    });
    expect(state.pending).toBe(false);
    return expect(state.data).toBe(error);
  });
  return test('some action', function() {
    var data, state;
    data = {
      someData: 'Something',
      another: []
    };
    state = Object.assign({}, actionDefaultState, {
      data: data
    });
    return expect(reducers.todos(state, {
      type: 'SOME_ACTION_TYPE'
    })).toEqual(state);
  });
});
