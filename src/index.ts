import rest from './internal-types/rest'
import setter from './internal-types/setter'
import fetch from './internal-types/fetch'
import action from './internal-types/action'

import combineEndpoints from './combine-endpoints'
import useApi from './use-api'

interface Account {
  id: string
  title: string
}


// createApiForType('', rest<Account>()).actions.update()

// combineEndpoints


// const api = combineEndpoints(
//   {
//     accounts: rest<Account>(),
//     currentAccount: setter<Account>()
//   }
// )



// const useMyApi = () => useApi<typeof api>()


// ;
// (async () => {
//   const {data} = await useMyApi().requests.accounts.show(1)

//   // data.id

// })





export {
  combineEndpoints,
  useApi,
  rest,
  action,
  fetch,
  setter
}




// trivialRedux = function(endpoints, settings) {
//   var actions, asyncActions, baseEndpoint, customType,  defaultEndpoint, endpoint, isCustom, name, ref1, type;

//   if (settings == null) {
//     settings = {};
//   }
//   const api = createApi()
//   settings.types || (settings.types = [])


//   const customTypes = settings.types.reduce(function(obj, type) {
//     if (!type.name) {
//       throw "[trivial-redux] Name for custom endpoint type is required";
//     }
//     obj[type.name] = type;
//     return obj;
//   }, {})



//   for (name in endpoints) {
//     endpoint = endpoints[name];
//     ref1 = typeFrom(endpoint, settings), type = ref1[0], isCustom = ref1[1];
//     if (isCustom && (customTypes[type] == null)) {
//       throw "Unknown endpoint type \"" + type + "\"";
//     }
//     defaultEndpoint = defaultEndpointFor(endpoint);
//     baseEndpoint = Object.assign({}, defaultEndpoint, settings);
//     endpoint = (endpoint != null) && typeof endpoint === 'object' ? Object.assign({}, baseEndpoint, endpoint) : baseEndpoint;
//     customType = customTypes[type];

//     if (customType.hasOwnProperty('initialState')) {
//       customType.reducer.defaultState = customType.initialState;
//     }
//     actions = (typeof customType.actions === "function" ? customType.actions(name, endpoint, settings) : void 0) || {};
//     asyncActions = (typeof customType.asyncActions === "function" ? customType.asyncActions(name, endpoint, settings) : void 0) || {};
//     api.types[name] = createActionTypes(name, actions, asyncActions);

//     if(!endpoint.stateless){
//       api.actions[name] = Object.assign({}, prepareActions(actions, api.types[name]), prepareActions(asyncActions, api.types[name]));
//       api.reducers[name] = createReducer(name, customType.reducer, endpoint, api.types);
//     }


//     plugins.forEach(function(plugin) {
//       return plugin(name, endpoint, api);
//     });
//   }
//   return api;
// };

// module.exports = trivialRedux;

// module.exports.actionTypesFor = function() {
//   var args;
//   args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
//   return actionTypesFor.apply(null, args);
// };

// module.exports.defaultStates = require('./states');


