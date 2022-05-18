var actionTypeFor, api, trivialRedux;

trivialRedux = require('../../src/index');

actionTypeFor = require('../../src/action_type');

api = null;

beforeEach(function() {
  return api = trivialRedux({
    token: {
      type: 'setter'
    }
  });
});

describe('Setter actions', function() {
  test('action set with data', function() {
    var action;
    action = api.actions.token.set('SOME_TOKEN');
    expect(action.payload).toBe('SOME_TOKEN');
    expect(action.type).toBe(actionTypeFor('set', 'token'));
    return expect(action.types).toBeUndefined();
  });
  return test('reset action', function() {
    var action;
    action = api.actions.token.reset();
    expect(action.type).toBe(actionTypeFor('reset', 'token'));
    expect(action.payload).toBeUndefined();
    return expect(action.types).toBeUndefined();
  });
});
