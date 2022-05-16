var createActionTypes, createReducerContext;

createActionTypes = require('./create_action_types');

createReducerContext = function(entityName, allTypes, reducer) {
  var context;
  context = {
    types: allTypes[entityName],
    reducer: reducer,
    allTypes: allTypes
  };
  return Object.freeze(context);
};

module.exports = createReducerContext;
