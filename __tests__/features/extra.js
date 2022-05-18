var api, trivialRedux;

trivialRedux = require('../../src/index');

api = trivialRedux({
  todos: {
    entry: 'todos',
    extra: {
      meta: {
        someKey: 'someValue'
      }
    }
  }
});

describe('Extra options', function() {
  return test('extra options for endpoint', function() {
    var action;
    action = api.actions.todos.index();
    expect(action.types).toBeDefined();
    expect(action.meta).toBeDefined();
    expect(action.meta.fetch).toBeDefined();
    expect(action.meta.fetch.url).toBe('todos.json');
    return expect(action.meta.someKey).toBe('someValue');
  });
});
