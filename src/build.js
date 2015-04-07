var util = require('util');
var fs = require('fs-extra');
var spawn = require('./spawner');

/**
 * Build geojson output files per admin_level found in the input pbf file.
 *
 * @param {string} inputFile
 * @param {string} outputDir
 * @param {object} [options] commander will pass this argument, not used
 * @param {function} [callback] optional
 */
module.exports = function build(inputFile, outputDir, options, callback) {
  fs.ensureDirSync(outputDir);

  var cmd = util.format('%s/../node_modules/.bin/fences-builder', __dirname);
  var args = [ '--inputFile=' + inputFile, '--outputDir=' + outputDir ];

  spawn(cmd, args, callback);
};