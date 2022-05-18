import {Api} from './types'
import createApiForType from './create-api-for-type'


export default <T>(endpoints: T) : Api<T> => {

  const api =  {
    actions: {},
    requests: {},
    types: {},
    reducers: {}
  }

  Object.entries(endpoints).forEach(([name, factory]) => {
    const {reducer, actions, requests, types} = createApiForType(name, factory, api.types)

    api.reducers[name] = reducer
    api.requests[name] = requests
    api.actions[name] = actions
    api.types[name] = types

  })

  return api as Api<T>
}
