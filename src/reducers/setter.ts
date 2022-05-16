var actionTypeFor, actionTypesFor, cloneDeep, createFetchReducerFor, defaultState;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

defaultState = require('../states/setter');

cloneDeep = require('lodash').cloneDeep;

createFetchReducerFor = function(entity_name, initialState) {
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
};

createFetchReducerFor.defaultState = defaultState;

module.exports = createFetchReducerFor;
