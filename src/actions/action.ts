var actionTypeFor, actionTypesFor, urlFormat;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

urlFormat = require('../utils/url_format');

module.exports = function(entity_name, endpoint, settings) {
  var format;
  format = urlFormat(settings);
  return {
    execute: function(data, options) {
      if (options == null) {
        options = {};
      }
      return {
        types: actionTypesFor('execute', entity_name),
        meta: {
          fetch: Object.assign({}, {
            url: format(endpoint),
            method: 'POST',
            data: data
          }, options)
        }
      };
    },
    reset: function() {
      return {
        type: actionTypeFor('reset', entity_name)
      };
    }
  };
};
