var util = require('util');
var fs = require('fs-extra');
var colors = require('colors');
var spawn = require('./spawner');

/**
 * Slice the geojson files found in inputDir by specified regions.
 *
 * @param {string} inputRegionFile
 * @param {string} outputRegionFile
 * @param {object} [options] commander will pass this argument, not used
 * @param {function} [callback] optional
 */
module.exports = function regions(inputRegionFile, outputRegionFile, options, callback) {

  if (!fs.existsSync(inputRegionFile)) {
    console.error(colors.red('[Error]:'), 'Region file does not exist');
    process.exit(1);
  }

  var cmd = util.format('%s/../node_modules/.bin/fences-regions', __dirname);
  var args = [ '--inputGeojson=' + inputRegionFile, '--outputFile=' + outputRegionFile ];

  spawn(cmd, args, callback);
};
