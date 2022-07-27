import actionTypesFor from '../action_types'

import actionTypeFor from '../action_type'

export default function(entityName, actions, asyncActions) {
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
