const {default: actionTypesFor} = require('../../src/action_types');

const {default: actionTypeFor} = require('../../src/action_type');



const {combineEndpoints, action} = require( '../../src/index')

const api = combineEndpoints({
  todos: action({
    entry: 'http://www.somesite.somedomain/todos'
  })
});

describe('Fetch actions', function() {
  return test('execute action', function() {
    var action, fetch, ref, ref1, types;
    action = (ref = api.requests.todos.execute({
      test: 1
    }), (ref1 = ref.meta, fetch = ref1.fetch), types = ref.types, ref);
    expect(types).toEqual(actionTypesFor('execute', 'todos'));
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
    expect(fetch.params).toBeUndefined();
    expect(fetch.data).toEqual({
      test: 1
    });
    expect(Object.keys(fetch).length).toBe(3);
    return expect(action.isRequest).toBe(true);
  });
});
