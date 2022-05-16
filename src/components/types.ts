var createActionTypes;

createActionTypes = require('../utils/create_action_types');

module.exports = function(name, endpoint, settings, api, type) {
  return createActionTypes(name, api.actions[name]);
};
