var actionTypeFor, actionTypesFor, createFetchReducerFor, defaultState;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

defaultState = require('../states/fetch');

createFetchReducerFor = function(entity_name, initialState) {
  return function(state, action) {
    if (state == null) {
      state = initialState;
    }
    switch (action.type) {
      case this.types.fetch.load:
        state.fetching = true;
        break;
      case this.types.fetch.success:
        state.lastUpdatedAt = new Date().getTime();
        state.data = action.payload;
        state.fetching = false;
        break;
      case this.types.fetch.failure:
        state.data = action.payload;
        state.fetching = false;
        break;
      case this.types.reset:
        Object.keys(initialState).forEach((function(_this) {
          return function(key) {
            return state[key] = initialState[key];
          };
        })(this));
        break;
      default:
        return state;
    }
  };
};

createFetchReducerFor.defaultState = defaultState;

module.exports = createFetchReducerFor;
