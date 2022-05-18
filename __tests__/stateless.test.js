var actionTypeFor, actionTypesFor, api, trivialRedux;

trivialRedux = require('../src/index');

actionTypesFor = require('../src/action_types');

actionTypeFor = require('../src/action_type');

api = trivialRedux({
  todos: {
    entry: 'http://www.somesite.somedomain/todos',
    type: 'rest',
    stateless: true
  }
});

describe('Stateless endpoint', function() {
  return test('api contains only requests', function() {
    expect(api.requests.todos).toBeDefined();
    expect(api.actions.todos).toBeUndefined();
    return expect(api.reducers.todo).toBeUndefined();
  });
});
