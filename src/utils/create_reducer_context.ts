const createReducerContext = function(entityName, {allTypes, types}, reducer = null) {
  const context = {
    types,
    reducer,
    allTypes
  };
  return Object.freeze(context);
};

export default createReducerContext
