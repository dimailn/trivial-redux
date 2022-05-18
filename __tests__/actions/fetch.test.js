const {default: actionTypesFor} = require('../../src/action_types');

const {default: actionTypeFor} = require('../../src/action_type');



const {combineEndpoints, fetch} = require( '../../src/index')

const api = combineEndpoints({
  todos: fetch({
    entry: 'http://www.somesite.somedomain/todos',
  })
})


describe('Fetch actions', function() {
  test('fetch', function() {
    var fetch, ref, ref1, types;
    ref = api.actions.todos.fetch(), (ref1 = ref.meta, fetch = ref1.fetch), types = ref.types;
    expect(types).toEqual(actionTypesFor('fetch', 'todos'));
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
    expect(fetch.params).toBeUndefined();
    return expect(Object.keys(fetch).length).toBe(2);
  });
  test('fetch with id', function() {
    var fetch, ref, ref1, types;
    ref = api.actions.todos.fetch(5), (ref1 = ref.meta, fetch = ref1.fetch), types = ref.types;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos/5.json');
    expect(fetch.params).toBeUndefined();
    return expect(Object.keys(fetch).length).toBe(2);
  });
  test('fetch with data', function() {
    var data, fetch, ref, ref1, types;
    data = {
      title: 'one more thing'
    };
    ref = api.actions.todos.fetch(data), (ref1 = ref.meta, fetch = ref1.fetch), types = ref.types;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
    expect(fetch.params).toEqual(data);
    return expect(Object.keys(fetch).length).toBe(2);
  });
  test('fetch with id and data', function() {
    var data, fetch, ref, ref1, types;
    data = {
      search: 'something'
    };
    ref = api.actions.todos.fetch(5, data), (ref1 = ref.meta, fetch = ref1.fetch), types = ref.types;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos/5.json');
    expect(fetch.params).toEqual(data);
    return expect(Object.keys(fetch).length).toBe(2);
  });
  test('fetch with skipFormat', function() {
    const api = combineEndpoints({
      todos: fetch({
        entry: 'http://www.somesite.somedomain/todos',
        skipFormat: true
      })
    });
    const action = api.actions.todos.fetch()

    const actionFetch = action.meta.fetch

    expect(actionFetch.url).toBe('http://www.somesite.somedomain/todos');
    expect(actionFetch.params).toBeUndefined();
    return expect(Object.keys(actionFetch).length).toBe(2);
  });
  return test('reset', function() {
    return expect(api.actions.todos.reset().type).toBe(actionTypeFor('reset', 'todos'));
  });
});
