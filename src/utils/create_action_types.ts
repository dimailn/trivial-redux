var actionTypeFor, actionTypesFor, createActionTypes;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

createActionTypes = function(entityName, actions) {
  var ac, actionTypes, name;
  actionTypes = {};
  for (name in actions) {
    ac = actions[name];
    actionTypes[name] = ['set', 'reset'].includes(name) ? actionTypeFor(name, entityName) : actionTypesFor(name, entityName);
  }
  return actionTypes;
};

module.exports = createActionTypes;
