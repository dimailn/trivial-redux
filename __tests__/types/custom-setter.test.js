var actionTypeFor, actionTypesFor, api, cloneDeep, customSetter, defaultState, defaultStates, endpoints, reducer, ref, trivialRedux;

trivialRedux = (ref = require('../../src/index'), defaultStates = ref.defaultStates, ref);

actionTypesFor = require('../../src/action_types');

actionTypeFor = require('../../src/action_type');

defaultState = require('../../src/states/setter');

cloneDeep = require('lodash').cloneDeep;

customSetter = {
  name: 'custom-setter',
  initialState: null,
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
  actions: function(entityName, endpoint, settings) {
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
};

endpoints = {
  token: {
    type: 'custom-setter'
  }
};

api = trivialRedux(endpoints, {
  types: [customSetter]
});

reducer = api.reducers.token;

describe('CUSTOM SETTER reducer', function() {
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
