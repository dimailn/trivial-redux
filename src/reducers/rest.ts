var actionTypeFor, actionTypesFor, createRestReducerFor, defaultState, handleNextPage;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

defaultState = require('../states/rest');

handleNextPage = function(state, action, types) {
  switch (action.type) {
    case types.load:
      return state.fetching = true;
    case types.success:
      state.fetching = false;
      state.nextPage = state.nextPage ? state.nextPage + 1 : 2;
      return state.data.collection = state.data.collection.concat(action.payload);
    case types.failure:
      state.fetching = false;
      return state.error = action.response;
  }
};

createRestReducerFor = function(entity_name, initialState) {
  return function(state, action) {
    if (state == null) {
      state = initialState;
    }
    switch (action.type) {
      case this.types.index.load:
        state.fetching = true;
        break;
      case this.types.index.success:
        state.lastUpdatedAt = new Date().getTime();
        state.data.collection = action.payload;
        state.fetching = false;
        state.error = null;
        break;
      case this.types.index.failure:
        state.fetching = false;
        state.error = action.response;
        break;
      case this.types.show.load:
        state.fetching = true;
        break;
      case this.types.show.success:
        state.data.current = action.payload;
        state.fetching = false;
        break;
      case this.types.show.failure:
        state.fetching = false;
        state.error = action.response;
        break;
      case this.types.reset:
        Object.keys(initialState).forEach((function(_this) {
          return function(key) {
            return state[key] = initialState[key];
          };
        })(this));
        break;
      case this.types.nextPage.load:
      case this.types.nextPage.success:
      case this.types.nextPage.failure:
        if (action.meta.page === state.nextPage || (state.nextPage == null)) {
          handleNextPage.bind(this)(state, action, this.types.nextPage);
        }
        break;
      case this.types.update.success:
        state.fetching = false;
        state.data = {
          collection: state.data.collection.map(function(entity) {
            if (entity.id === action.payload.id) {
              return action.payload;
            } else {
              return entity;
            }
          }),
          oldCurrent: null,
          current: null
        };
        break;
      default:
        return state;
    }
  };
};

createRestReducerFor.defaultState = defaultState;

module.exports = createRestReducerFor;
