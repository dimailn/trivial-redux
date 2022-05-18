var actionTypeFor, actionTypesFor, api, trivialRedux;

trivialRedux = require('../../src/index');

actionTypesFor = require('../../src/action_types');

actionTypeFor = require('../../src/action_type');

api = trivialRedux({
  todos: {
    entry: 'http://www.somesite.somedomain/todos',
    type: 'fetch'
  }
});

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
    var fetch, ref, ref1, types;
    api = trivialRedux({
      todos: {
        entry: 'http://www.somesite.somedomain/todos',
        type: 'fetch',
        skipFormat: true
      }
    });
    ref = api.actions.todos.fetch(), (ref1 = ref.meta, fetch = ref1.fetch), types = ref.types;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos');
    expect(fetch.params).toBeUndefined();
    return expect(Object.keys(fetch).length).toBe(2);
  });
  return test('reset', function() {
    return expect(api.actions.todos.reset().type).toBe(actionTypeFor('reset', 'todos'));
  });
});
