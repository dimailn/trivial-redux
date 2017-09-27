components =
  actions: require './actions'
  reducers: require './reducers'
  types: require './types'

module.exports = components

module.exports.createApi = -> Object.keys(components).reduce(
  (api, name) -> api[name] = {}; api
  {}
)