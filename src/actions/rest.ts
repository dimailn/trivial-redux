var actionTypeFor, actionTypesFor, urlFormat;

actionTypesFor = require('../action_types');

actionTypeFor = require('../action_type');

urlFormat = require('../utils/url_format');

module.exports = function(entity_name, endpoint, settings) {
  var format;
  format = urlFormat(settings);
  return {
    index: function(params) {
      return {
        types: actionTypesFor('index', entity_name),
        meta: {
          fetch: {
            url: format(endpoint),
            params: params
          }
        }
      };
    },
    show: function(id) {
      return {
        types: actionTypesFor('show', entity_name),
        meta: {
          fetch: {
            url: format(endpoint + "/" + id)
          }
        }
      };
    },
    create: function(data) {
      return {
        types: actionTypesFor('create', entity_name),
        meta: {
          fetch: {
            url: format(endpoint),
            data: data,
            method: 'POST'
          }
        }
      };
    },
    update: function(id, data) {
      return {
        types: actionTypesFor('update', entity_name),
        meta: {
          fetch: {
            url: format(endpoint + "/" + id),
            method: "PUT",
            data: data
          }
        }
      };
    },
    destroy: function(id) {
      return {
        types: actionTypesFor('destroy', entity_name),
        meta: {
          fetch: {
            url: format(endpoint + "/" + id),
            method: "DELETE"
          }
        }
      };
    },
    reset: function() {
      return {
        type: actionTypeFor('reset', entity_name)
      };
    },
    nextPage: function(params) {
      return function(dispatch, getState) {
        var nextPage;
        nextPage = getState()[entity_name].nextPage;
        params = Object.assign({}, {
          page: nextPage || 1
        }, params);
        return dispatch({
          types: actionTypesFor('nextPage', entity_name),
          meta: {
            fetch: {
              url: format(endpoint),
              params: params
            },
            page: params.page
          }
        });
      };
    }
  };
};
