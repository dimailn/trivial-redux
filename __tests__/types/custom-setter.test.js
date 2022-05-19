var api, cloneDeep, customSetter, reducer

const {default: actionTypesFor} = require('../../src/action_types');

const {default: actionTypeFor} = require('../../src/action_type');

const {default: setterDefaultState} = require('../../src/states/setter')


const {combineEndpoints, rest} = require( '../../src/index')

cloneDeep = require('lodash').cloneDeep;


customSetter = ({initialState}) => ({
  name: 'custom-setter',
  initialState,
  reducer: function(entityName, initialState) {
    return function(state, action) {
      if (state == null) {
        state = initialState;
      }
      switch (action.type) {
        case this.types.set:
          return action.payload;
        case this.types.reset:
          return cloneDeep(initialState);
        default:
          return state;
      }
    };
  },
  asyncActions(){
    return {}
  },
  actions: function(entityName, options) {
    return {
      set: function(data) {
        return {
          payload: data
        };
      },
      reset: function() {
        return {};
      }
    };
  }
});



api = combineEndpoints({
  token: customSetter({})
});

reducer = api.reducers.token;

describe('CUSTOM SETTER reducer', function() {
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
