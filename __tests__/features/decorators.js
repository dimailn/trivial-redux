var AuthDecorator, api, defaultStates, ref, trivialRedux;

trivialRedux = (ref = require('../../src/index'), defaultStates = ref.defaultStates, ref);

AuthDecorator = function(reducer) {
  return function(state, action) {
    if (action.type === this.types.index.failure) {
      return Object.assign({}, reducer(state, action), {
        noAccess: true
      });
    } else {
      return reducer(state, action);
    }
  };
};

api = null;

describe('Decorators for reducer', function() {
  describe("endpoint with custom reducer", function() {
    beforeEach(function() {
      return api = trivialRedux({
        todos: {
          entry: '~todos',
          decorators: [AuthDecorator],
          reducer: function(state, action) {
            if (action.type === this.types.index.failure) {
              return Object.assign({}, this.reducer(state, action), {
                anotherData: 'Some error'
              });
            } else {
              return this.reducer(state, action);
            }
          }
        }
      });
    });
    test('simple auth decorator', function() {
      var state;
      state = Object.assign({}, defaultStates.rest);
      state = api.reducers.todos(state, {
        type: api.types.todos.index.failure
      });
      expect(state.noAccess).toBe(true);
      expect(state.anotherData).toBe('Some error');
      return expect(state.fetching).toBe(false);
    });
    return test('process initial', function() {
      var state;
      state = Object.assign({}, defaultStates.rest);
      state = api.reducers.todos(void 0, {
        type: "INIT"
      });
      return expect(state.fetching).toBe(false);
    });
  });
  describe("endpoint without customer reducer", function() {
    beforeEach(function() {
      return api = trivialRedux({
        todos: {
          entry: '~todos',
          decorators: [AuthDecorator]
        }
      });
    });
    test('simple auth decorator', function() {
      var state;
      state = Object.assign({}, defaultStates.rest);
      state = api.reducers.todos(state, {
        type: api.types.todos.index.failure
      });
      expect(state.noAccess).toBe(true);
      return expect(state.fetching).toBe(false);
    });
    return test('process initial', function() {
      var state;
      state = Object.assign({}, defaultStates.rest);
      state = api.reducers.todos(void 0, {
        type: "INIT"
      });
      return expect(state.fetching).toBe(false);
    });
  });
  return describe("decorator with immer", function() {
    beforeEach(function() {
      AuthDecorator = function(reducer) {
        return function(state, action) {
          if (action.type === this.types.index.failure) {
            reducer(state, action);
            state.noAccess = true;
          } else {
            return reducer(state, action);
          }
        };
      };
      AuthDecorator.immer = true;
      return api = trivialRedux({
        todos: {
          entry: '~todos',
          decorators: [AuthDecorator]
        }
      });
    });
    test('changes value', function() {
      var state;
      state = Object.assign({}, defaultStates.rest);
      state = api.reducers.todos(state, {
        type: api.types.todos.index.failure
      });
      expect(state.noAccess).toBe(true);
      return expect(state.fetching).toBe(false);
    });
    return test('process initial', function() {
      var state;
      state = Object.assign({}, defaultStates.rest);
      state = api.reducers.todos(void 0, {
        type: "INIT"
      });
      return expect(state.fetching).toBe(false);
    });
  });
});
