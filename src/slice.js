// this function has too many parameters, but the are coming from commander and cannot be refactored
/* jshint ignore:start */

var util = require('util');
var fs = require('fs-extra');
var colors = require('colors');
var spawn = require('./spawner');

/**
 * Slice the geojson files found in inputDir by specified regions.
 *
 * @param {string} regionFile
 * @param {string} inputDir
 * @param {string} outputDir
 * @param {object} [options] commander will pass this argument, not used
 * @param {function} [callback] optional
 */
module.exports = function slice(regionFile, inputDir, outputDir, options, callback) {

  if (!fs.existsSync(regionFile) || !fs.existsSync(inputDir)) {
    console.error(colors.red('[Error]:'), 'Region file or inputDir do not exist');
    process.exit(1);
  }

  // create output dir if it doesn't exist
  fs.ensureDirSync(outputDir);

  var cmd = util.format('%s/../node_modules/.bin/fences-slicer', __dirname);
  var args = [ '--config=' + regionFile, '--inputDir=' + inputDir, '--outputDir=' + outputDir ];

  spawn(cmd, args, callback);
};
/* jshint ignore:end */
