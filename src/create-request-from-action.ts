export default (action) => {
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