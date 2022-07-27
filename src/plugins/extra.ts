var _, applyExtra,
  slice = [].slice;

_ = require('lodash');

export default function(actions, extra) {
  var actionCreator, actionName, actionsWithExtra, fn;
  actionsWithExtra = {};
  fn = function(actionCreator) {
    return actionsWithExtra[actionName] = function() {
      var action, args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      action = actionCreator.apply(null, args);
      if (typeof action === 'function') {
        return function(dispatch, getState, extraArgument) {
          var dispatchWrapper;
          dispatchWrapper = function(a) {
            return dispatch(_.merge(_.cloneDeep(a), extra));
          };
          return action(dispatchWrapper, getState, extraArgument);
        };
      } else {
        return _.merge(_.cloneDeep(action), extra);
      }
    };
  };
  for (actionName in actions) {
    actionCreator = actions[actionName];
    fn(actionCreator);
  }
  return actionsWithExtra;
}