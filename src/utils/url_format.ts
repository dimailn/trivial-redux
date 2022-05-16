var mutators;

mutators = [
  function(settings, url) {
    if (settings.skipFormat) {
      return url;
    }
    if (url[url.length - 1] === '/') {
      return url.slice(0, -1) + '.json';
    } else {
      return url + '.json';
    }
  }, function(settings, url) {
    var host;
    host = settings.host;
    if (host && url[0] === '~') {
      if (host[host.length - 1] !== '/') {
        host += '/';
      }
      return host + url.substr(1);
    } else {
      return url;
    }
  }
];

export default function(settings) {
  if (settings == null) {
    settings = {};
  }
  return function(url) {
    return mutators.reduce(function(resultUrl, mutator) {
      return mutator(settings, resultUrl);
    }, url);
  };
};
