process.chdir('./examples');
const babelRegister = require('@babel/register');
babelRegister();
module.exports = require('../../lib/webpack/webpack.prod.client.config');
