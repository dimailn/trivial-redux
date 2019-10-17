mutators = [
  (settings, url) ->
    return url if settings.skipFormat

    if url[url.length - 1] == '/'
      url[0...-1] + '.json'
    else
      url + '.json'
  (settings, url) ->
    {host} = settings
    if host && url[0] is '~'
      host += '/' if host[host.length - 1] isnt '/'
      host + url.substr(1)
    else
      url
]

module.exports = (settings = {}) -> (url) ->
  mutators.reduce(
    (resultUrl, mutator) -> mutator(settings, resultUrl)
    url
  )
