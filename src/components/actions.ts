var actions;

actions = require('../actions');

module.exports = function(name, endpoint, settings, api, type) {
  return actions[type](name, endpoint.entry, endpoint instanceof Object ? Object.assign({}, settings, endpoint) : {});
};
