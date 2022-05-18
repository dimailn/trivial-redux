import createReducerContext from './create_reducer_context'
import {produce} from 'immer'

const applyImmer = function(reducer) {
  return function(state, action) {
    return produce(state, function(draftState) {
      return reducer(draftState, action);
    });
  };
};

const applyDecorators = function(reducer, decorators, context) {
  return decorators.reduce(function(reducer, decorator) {
    reducer = decorator(reducer).bind(context);
    if (decorator.immer) {
      reducer = applyImmer(reducer);
    }
    return reducer;
  }, reducer);
};

export default function(entityName, reducerFactory, options, allTypes) {
  var context, innerContext, reducer, reducerWithImmer;

  const {
    initialState,
    decorators,
    immer
  } = options

  let customReducer = options.reducer

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
