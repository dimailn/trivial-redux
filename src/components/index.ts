import {mapValues} from 'lodash'
import actions from './actions'
import types from './types'
import reducers from './reducers'
import requests from './requests'

export const components = {
  actions,
  types,
  reducers,
  requests
}


export const createApi = function() {
  return mapValues(components, function() {
    return {}
  })
}