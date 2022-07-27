const {default: actionTypesFor} = require('../src/action_types');

const {default: actionTypeFor} = require('../src/action_type');
const {default: restDefaultState} = require('../src/states/rest')



const {combineEndpoints, rest} = require( '../src/index')


let api = combineEndpoints({
  todos: rest({
    entry: 'http://www.somesite.somedomain/todos',
    immer: true
  })
});

describe('Immer mode', function() {
  test("internal reducers works the same", function() {
    var state;
    state = Object.assign({}, restDefaultState);
    state = api.reducers.todos(state, {
      type: api.types.todos.index.load,
      payload: []
    });
    return expect(state.fetching).toBe(true);
  });
  test("mutation produces new object", function() {
    var firstState, state;
    api = combineEndpoints({
      todos: rest({
        entry: 'http://www.somesite.somedomain/todos',
        immer: true,
        reducer: function(state, action) {
          switch (action.type) {
            case this.types.index.load:
              state.fetching = true;
              state.newKey = true;
          }
        }
      })
    });
    firstState = Object.assign({}, restDefaultState);
    state = api.reducers.todos(firstState, {
      type: api.types.todos.index.load,
      payload: []
    });
    expect(state.fetching).toBe(true);
    expect(state.newKey).toBe(true);
    return expect(firstState !== state).toBe(true);
  });
  return test("return new state", function() {
    var firstState, state;
    api = combineEndpoints({
      todos: rest({
        entry: 'http://www.somesite.somedomain/todos',
        type: 'rest',
        reducer: function(state, action) {
          switch (action.type) {
            case this.types.index.load:
              return Object.assign({}, state, {
                fetching: true,
                newKey: true
              });
            default:
              return state;
          }
        }
      })
    });
    firstState = Object.assign({}, restDefaultState);
    state = api.reducers.todos(firstState, {
      type: api.types.todos.index.load,
      payload: []
    });
    expect(state.fetching).toBe(true);
    expect(state.newKey).toBe(true);
    return expect(firstState !== state).toBe(true);
  });
});
