import {
  components,
  createApi
} from './components'

import plugins from './plugins'

import typeFrom from './utils/type_from'

import defaultEndpointFor from './default_endpoint'

import actionTypesFor from './action_types'

import createReducer from './utils/create_reducer'

import createActionTypes from './utils/create_action_types_from_custom_type'

import prepareActions from './utils/prepare_actions'

import createEndpoint from './internal-types/rest'


import {createApiForType, combineEndpoints, Api, WrappedApi} from './types'


interface Account {
  id: string
  title: string
}




const accountFactory = createEndpoint<Account>("account")


const account = createApiForType(accountFactory, 'todo', {})


const endpoints = {
  account
}



const api : Api<typeof endpoints> = combineEndpoints(endpoints)



const useApi = () : WrappedApi<typeof api> => {
  return {
    actions: {},
    requests: {}
  }
}


useApi().requests.account.









trivialRedux = function(endpoints, settings) {
  var actions, asyncActions, baseEndpoint, customType,  defaultEndpoint, endpoint, isCustom, name, ref1, type;

  if (settings == null) {
    settings = {};
  }
  const api = createApi()
  settings.types || (settings.types = [])


  const customTypes = settings.types.reduce(function(obj, type) {
    if (!type.name) {
      throw "[trivial-redux] Name for custom endpoint type is required";
    }
    obj[type.name] = type;
    return obj;
  }, {})



  for (name in endpoints) {
    endpoint = endpoints[name];
    ref1 = typeFrom(endpoint, settings), type = ref1[0], isCustom = ref1[1];
    if (isCustom && (customTypes[type] == null)) {
      throw "Unknown endpoint type \"" + type + "\"";
    }
    defaultEndpoint = defaultEndpointFor(endpoint);
    baseEndpoint = Object.assign({}, defaultEndpoint, settings);
    endpoint = (endpoint != null) && typeof endpoint === 'object' ? Object.assign({}, baseEndpoint, endpoint) : baseEndpoint;
    customType = customTypes[type];

    if (customType.hasOwnProperty('initialState')) {
      customType.reducer.defaultState = customType.initialState;
    }
    actions = (typeof customType.actions === "function" ? customType.actions(name, endpoint, settings) : void 0) || {};
    asyncActions = (typeof customType.asyncActions === "function" ? customType.asyncActions(name, endpoint, settings) : void 0) || {};
    api.types[name] = createActionTypes(name, actions, asyncActions);

    if(!endpoint.stateless){
      api.actions[name] = Object.assign({}, prepareActions(actions, api.types[name]), prepareActions(asyncActions, api.types[name]));
      api.reducers[name] = createReducer(name, customType.reducer, endpoint, api.types);
    }


    plugins.forEach(function(plugin) {
      return plugin(name, endpoint, api);
    });
  }
  return api;
};

module.exports = trivialRedux;

module.exports.actionTypesFor = function() {
  var args;
  args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
  return actionTypesFor.apply(null, args);
};

module.exports.defaultStates = require('./states');


