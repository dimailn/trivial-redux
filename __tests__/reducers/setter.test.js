var api, defaultStates, reducer, ref, trivialRedux;


const {combineEndpoints, setter} = require( '../../src/index')


const {default: setterDefaultState} = require('../../src/states/setter')


api = combineEndpoints({
  token: setter({
  })
})

reducer = api.reducers.token;

describe('SETTER reducer', function() {
  test('set', function() {
    var state;
    state = reducer(setterDefaultState, api.actions.token.set('SOME_TOKEN'));
    return expect(state).toBe('SOME_TOKEN');
  });
  test('reset', function() {
    var state;
    state = reducer('SOME_TOKEN', api.actions.token.reset());
    return expect(state).toBe(setterDefaultState);
  });
  return test('unknown action', function() {
    var state;
    state = reducer('SOME_TOKEN', {
      type: 'SOME_ACTION_TYPE'
    });
    return expect(state).toBe('SOME_TOKEN');
  });
});
