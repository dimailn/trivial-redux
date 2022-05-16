var actionTypeFor, actionTypesFor, createActionReducerFor, defaultState;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

defaultState = require('../states/fetch');

createActionReducerFor = function(entity_name, initialState) {
  return function(state, action) {
    if (state == null) {
      state = initialState;
    }
    switch (action.type) {
      case this.types.execute.load:
        state.pending = true;
        break;
      case this.types.execute.success:
        state.lastExecutedAt = new Date().getTime();
        state.data = action.payload;
        state.pending = false;
        break;
      case this.types.execute.failure:
        state.data = action.payload;
        state.pending = false;
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

createActionReducerFor.defaultState = defaultState;

module.exports = createActionReducerFor;
