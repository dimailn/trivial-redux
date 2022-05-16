var actionTypeFor, actionTypesFor, createActionTypes;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

createActionTypes = function(entityName, actions, asyncActions) {
  var ac, actionTypes, name;
  actionTypes = {};
  for (name in asyncActions) {
    ac = asyncActions[name];
    actionTypes[name] = actionTypesFor(name, entityName);
  }
  for (name in actions) {
    ac = actions[name];
    actionTypes[name] = actionTypeFor(name, entityName);
  }
  return actionTypes;
};

module.exports = createActionTypes;
