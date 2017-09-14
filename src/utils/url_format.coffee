mutators = [
  (settings, url) -> if settings.skipFormat then url else url + '.json'
  (settings, url) ->
    {host} = settings
    if host
      host += '/' if host[host.length - 1] isnt '/'
      host + url
    else
      url
]

module.exports = (settings = {}) -> (url) ->
  mutators.reduce(
    (resultUrl, mutator) -> mutator(settings, resultUrl)
    url
  )
