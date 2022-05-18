var api, trivialRedux;

trivialRedux = require('../../src/index');

api = trivialRedux({
  todos: 'todos'
});

describe("Parse type", function() {
  return test("should work correct", function() {
    var desc;
    expect(typeof api.parseType).toBe('function');
    desc = api.parseType(api.types.todos.index.load);
    expect(desc.endpoint).toBe('todos');
    expect(desc.action).toBe('index');
    return expect(desc.status).toBe('PENDING');
  });
});
