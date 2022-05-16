var actionTypesFor;

actionTypesFor = function(action_name, entity_name) {
  return {
    load: action_name + "/" + entity_name + "/PENDING",
    success: action_name + "/" + entity_name + "/SUCCESS",
    failure: action_name + "/" + entity_name + "/FAILURE"
  };
};

module.exports = actionTypesFor;
