{mapValues} = require 'lodash'

components =
  actions: require './actions'
  reducers: require './reducers'
  types: require './types'

module.exports = components

module.exports.createApi = -> mapValues(components, -> {})