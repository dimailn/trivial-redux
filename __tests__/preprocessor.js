const coffee = require('coffee-script')
const babelJest = require('babel-jest')

module.exports = {
  process: (src, path) => {
    if (coffee.helpers.isCoffee(path)) {
      return Promise.resolve({code: coffee.compile(src, { bare: true })});
    }
    // if (!/node_modules/.test(path)) {
    //   return {code: babelJest.process(src, path)};
    // }
    // return src;
  }
};