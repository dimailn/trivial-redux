var actionTypeFor, actionTypesFor, urlFormat;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

urlFormat = require('../utils/url_format');

module.exports = function(entity_name, endpoint, settings) {
  var format;
  format = urlFormat(settings);
  return {
    fetch: function(idOrData, data) {
      var id;
      if (idOrData instanceof Object) {
        data = idOrData;
      } else {
        id = idOrData;
      }
      return {
        types: actionTypesFor('fetch', entity_name),
        meta: {
          fetch: {
            url: format(id != null ? endpoint + "/" + id : endpoint),
            params: data
          }
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
