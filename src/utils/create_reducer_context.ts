import createActionTypes from './create_action_types'

const createReducerContext = function(entityName, allTypes, reducer = null) {
  var context;
  context = {
    types: allTypes[entityName],
    reducer: reducer,
    allTypes: allTypes
  };
  return Object.freeze(context);
};

export default createReducerContext
