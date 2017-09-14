module.exports = (endpoints, settings, defaultType) ->
  if typeof endpoint is 'object'
    endpoint.type || settings.type || defaultType
  else
    defaultType