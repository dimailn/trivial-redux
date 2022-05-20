const {default: actionTypesFor} = require('../../src/action_types');

const {default: actionTypeFor} = require('../../src/action_type');



const {combineEndpoints, rest} = require( '../../src/index')

let api = null

beforeEach(function() {
  return api = combineEndpoints({
    todos: rest({entry: 'http://www.somesite.somedomain/todos' })
  });
});

describe('REST actions', function() {
  test('index without params', function() {
    var action, fetch;
    action = api.actions.todos.index();
    fetch = action.meta.fetch;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
    expect(fetch.params).toBeUndefined();
    expect(Object.keys(fetch).length).toBe(2);
    return expect(action.types).toEqual(actionTypesFor('index', 'todos'));
  });
  test('index with params', function() {
    var action, fetch;
    action = api.actions.todos.index({
      search: 'something'
    });
    fetch = action.meta.fetch;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
    expect(fetch.params.search).toBe('something');
    return expect(Object.keys(fetch).length).toBe(2);
  });
  test('index without params with own host', function() {
    var fetch;
    api = combineEndpoints({
      todos: rest({
        entry: '~todos'
      })
    }, {
      host: 'http://www.somesite.somedomain/'
    });
    fetch = api.actions.todos.index().meta.fetch;
    return expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
  });
  test('index without params with own host(simple endpoint description)', function() {
    var fetch;
    api = combineEndpoints({
      todos: rest({entry: '~todos'})
    }, {
      host: 'http://www.somesite.somedomain/'
    });
    fetch = api.actions.todos.index().meta.fetch;
    return expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
  });
  test('show', function() {
    var action, fetch;
    action = api.actions.todos.show(5);
    fetch = action.meta.fetch;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos/5.json');
    expect(Object.keys(fetch).length).toBe(1);
    return expect(action.types).toEqual(actionTypesFor('show', 'todos'));
  });
  test('create', function() {
    var action, data, fetch;
    data = {
      title: 'one more thing'
    };
    action = api.actions.todos.create(data);
    fetch = action.meta.fetch;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
    expect(fetch.method).toBe('POST');
    expect(fetch.data).toEqual(data);
    return expect(action.types).toEqual(actionTypesFor('create', 'todos'));
  });
  test('update', function() {
    var data, fetch, ref, ref1, types;
    data = {
      title: 'one more thing'
    };
    ref = api.actions.todos.update(5, data), (ref1 = ref.meta, fetch = ref1.fetch), types = ref.types;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos/5.json');
    expect(fetch.method).toBe('PUT');
    expect(fetch.data).toEqual(data);
    return expect(types).toEqual(actionTypesFor('update', 'todos'));
  });
  test('destroy', function() {
    var fetch, ref, ref1, types;
    ref = api.actions.todos.destroy(5), (ref1 = ref.meta, fetch = ref1.fetch), types = ref.types;
    expect(fetch.url).toBe('http://www.somesite.somedomain/todos/5.json');
    expect(fetch.method).toBe('DELETE');
    return expect(types).toEqual(actionTypesFor('destroy', 'todos'));
  });
  test('reset', function() {
    return expect(api.actions.todos.reset().type).toBe(actionTypeFor('reset', 'todos'));
  });
  test('nextPage', function() {
    var dispatch, fAction, getState;
    getState = function() {
      return {
        todos: {
          nextPage: 2
        }
      };
    };
    dispatch = function(action) {
      var fetch;
      fetch = action.meta.fetch;
      expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
      return expect(fetch.params).toEqual({
        page: 2
      });
    };
    dispatch = jest.fn(dispatch);
    fAction = api.actions.todos.nextPage();
    fAction(dispatch, getState);
    return expect(dispatch).toHaveBeenCalled();
  });
  return test('nextPage with extra', function() {
    var dispatch, fAction, getState;
    api = combineEndpoints({
      todos: rest({
        entry: 'http://www.somesite.somedomain/todos',
        extra: {
          meta: {
            skipSome: true
          }
        }
      })
    });
    getState = function() {
      return {
        todos: {
          nextPage: 2
        }
      };
    };
    dispatch = function(action) {
      var fetch;
      fetch = action.meta.fetch;
      expect(fetch.url).toBe('http://www.somesite.somedomain/todos.json');
      expect(fetch.params).toEqual({
        page: 2
      });
      return expect(action.meta.skipSome).toBe(true);
    };
    dispatch = jest.fn(dispatch);
    fAction = api.actions.todos.nextPage();
    fAction(dispatch, getState);
    return expect(dispatch).toHaveBeenCalled();
  });
});
