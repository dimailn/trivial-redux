const {combineEndpoints, rest} = require( '../../src/index')


const api = trivialRedux({
  todos: rest({
    entry: 'http://www.somesite.somedomain/todos',
    stateless: true
  })
});

describe('Stateless endpoint', function() {
  return test('api contains only requests', function() {
    expect(api.requests.todos).toBeDefined();
    expect(api.actions.todos).toBeUndefined();
    return expect(api.reducers.todo).toBeUndefined();
  });
});
