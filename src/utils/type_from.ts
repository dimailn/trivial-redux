var DEFAULT_ENDPOINT_TYPE, actions, reducers;

actions = require('../actions');

reducers = require('../reducers');

DEFAULT_ENDPOINT_TYPE = 'rest';

module.exports = function(endpoint, settings) {
  var type;
  type = typeof endpoint === 'object' ? endpoint.type || settings.type || DEFAULT_ENDPOINT_TYPE : DEFAULT_ENDPOINT_TYPE;
  return [type, !((actions[type] != null) && (reducers[type] != null))];
};
