var api, defaultStates, reducer, ref, trivialRedux;

trivialRedux = (ref = require('../../src/index'), defaultStates = ref.defaultStates, ref);

api = trivialRedux({
  token: {
    type: 'setter'
  }
});

reducer = api.reducers.token;

describe('SETTER reducer', function() {
  test('set', function() {
    var state;
    state = reducer(defaultStates.setter, api.actions.token.set('SOME_TOKEN'));
    return expect(state).toBe('SOME_TOKEN');
  });
  test('reset', function() {
    var state;
    state = reducer('SOME_TOKEN', api.actions.token.reset());
    return expect(state).toBe(defaultStates.setter);
  });
  return test('unknown action', function() {
    var state;
    state = reducer('SOME_TOKEN', {
      type: 'SOME_ACTION_TYPE'
    });
    return expect(state).toBe('SOME_TOKEN');
  });
});
