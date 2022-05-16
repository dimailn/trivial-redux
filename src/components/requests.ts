var actions, cloneDeep,
  slice = [].slice;

actions = require('./actions');

cloneDeep = require('lodash').cloneDeep;

module.exports = function() {
  var _actions, args, creator, name, ref;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  _actions = {};
  ref = actions.apply(null, args);
  for (name in ref) {
    creator = ref[name];
    _actions[name] = (function(creator) {
      return function() {
        var action, creatorArgs;
        creatorArgs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        action = creator.apply(null, creatorArgs);
        if (typeof action === 'object') {
          action = cloneDeep(action);
          action.isRequest = true;
          return action;
        } else {
          return function(dispatch, getState) {
            var wrappedDispatch;
            wrappedDispatch = function(dispatchedAction) {
              if (dispatchedAction.types == null) {
                return dispatch(dispatchedAction);
              }
              dispatchedAction = cloneDeep(dispatchedAction);
              dispatchedAction.isRequest = true;
              return dispatch(dispatchedAction);
            };
            return action(wrappedDispatch, getState);
          };
        }
      };
    })(creator);
  }
  return _actions;
};
