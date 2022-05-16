var actionTypeFor;

actionTypeFor = require('../action_type');

module.exports = function(entity_name, endpoint, settings) {
  return {
    set: function(data) {
      return {
        type: actionTypeFor('set', entity_name),
        payload: data
      };
    },
    reset: function() {
      return {
        type: actionTypeFor('reset', entity_name)
      };
    }
  };
};
