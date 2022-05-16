var createReducer, reducers;

reducers = require('../reducers');

createReducer = require('../utils/create_reducer');

module.exports = function(name, endpoint, settings, api, type) {
  return createReducer(name, reducers[type], endpoint, api.types);
};
