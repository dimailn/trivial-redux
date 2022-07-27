var actionTypeFor, actionTypesFor;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

module.exports = function(name, endpoint, api) {
  api.typeFor = actionTypeFor;
  api.typesFor = actionTypesFor;
  return api.parseType = function(type) {
    var tokens;
    tokens = type.split('/');
    return {
      action: tokens[0],
      endpoint: tokens[1],
      status: tokens[2]
    };
  };
};
