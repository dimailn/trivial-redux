var slice = [].slice;

export default function(actionCreators, types) {
  var decoratedActionCreators;
  decoratedActionCreators = {};
  Object.keys(actionCreators).forEach(function(name) {
    var actionCreator, type;
    actionCreator = actionCreators[name];
    type = types[name];
    return decoratedActionCreators[name] = function() {
      var action, args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      action = actionCreator.apply(null, args);
      if (typeof action !== 'object') {
        action = {};
        console.warn('[trivial-redux] Action creator in custom type must return an object');
      }
      if (!action.type) {
        action.type = type;
      }
      return action;
    };
  });
  return decoratedActionCreators;
};
