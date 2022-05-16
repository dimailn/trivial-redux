var applyDecorators, applyImmer, createReducerContext, produce;

createReducerContext = require('./create_reducer_context');

produce = require('immer').produce;

applyImmer = function(reducer) {
  return function(state, action) {
    return produce(state, function(draftState) {
      return reducer(draftState, action);
    });
  };
};

applyDecorators = function(reducer, decorators, context) {
  return decorators.reduce(function(reducer, decorator) {
    reducer = decorator(reducer).bind(context);
    if (decorator.immer) {
      reducer = applyImmer(reducer);
    }
    return reducer;
  }, reducer);
};

module.exports = function(entityName, reducerFactory, endpoint, allTypes) {
  var context, customReducer, decorators, immer, initialState, innerContext, reducer, reducerWithImmer;
  initialState = endpoint.initialState, customReducer = endpoint.reducer, decorators = endpoint.decorators, immer = endpoint.immer;
  innerContext = createReducerContext(entityName, allTypes);
  reducer = reducerFactory(entityName, initialState || reducerFactory.defaultState);
  reducer = reducer.bind(innerContext);
  reducerWithImmer = applyImmer(reducer);
  context = createReducerContext(entityName, allTypes, reducerWithImmer);
  if (customReducer == null) {
    return applyDecorators(reducerWithImmer, decorators, context);
  }
  if (!immer) {
    reducer = applyImmer(reducer);
  }
  context = createReducerContext(entityName, allTypes, reducer);
  customReducer = customReducer.bind(context);
  customReducer = applyDecorators(customReducer, decorators, context);
  if (immer) {
    customReducer = applyImmer(customReducer);
  }
  return function(state, action) {
    if (state == null) {
      state = initialState;
    }
    return customReducer(state, action, reducer, initialState);
  };
};
