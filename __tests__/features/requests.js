var api, trivialRedux;

trivialRedux = require('../../src/index');

api = trivialRedux({
  todos: 'todos'
});

describe("Requests", function() {
  test("should be", function() {
    expect(typeof api.requests).toBe('object');
    return expect(typeof api.requests.todos.index).toBe('function');
  });
  test("plain action", function() {
    var action;
    action = api.requests.todos.index();
    expect(action.isRequest).toBe(true);
    return expect(action.types).toEqual(api.typesFor('index', 'todos'));
  });
  test("function action", function() {
    var action, dispatch, getState;
    action = api.requests.todos.nextPage();
    dispatch = jest.fn(function(action) {
      expect(action.isRequest).toBe(true);
      return expect(action.types).toEqual(api.typesFor('nextPage', 'todos'));
    });
    getState = function() {
      return {
        todos: api.reducers.todos(void 0, {
          type: 'init'
        })
      };
    };
    action(dispatch, getState);
    return expect(dispatch).toBeCalled();
  });
  return test("with extra", function() {
    var action;
    api = trivialRedux({
      todos: 'todos'
    }, {
      extra: {
        camelizeKeys: true
      }
    });
    action = api.requests.todos.index();
    return expect(action.camelizeKeys).toBe(true);
  });
});
