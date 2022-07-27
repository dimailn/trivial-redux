var _, applyExtra,
  slice = [].slice;

const cloneDeep = require('lodash.clonedeep')
const merge = require('lodash.merge')

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
            return dispatch(merge(cloneDeep(a), extra));
          };
          return action(dispatchWrapper, getState, extraArgument);
        };
      } else {
        return merge(cloneDeep(action), extra);
      }
    };
  };
  for (actionName in actions) {
    actionCreator = actions[actionName];
    fn(actionCreator);
  }
  return actionsWithExtra;
}