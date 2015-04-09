var fs = require('fs-extra');
var path = require('path');
var async = require('async');
var colors = require('colors');
var spawn = require('./spawner');

/**
 * 1. Convert PBF file o5m
 * 2. Filter out admin boundaries
 * 3. Convert back to pbf
 *
 * @param {string} pbfFile
 * @param {string} outputFile
 * @param {object} options
 * @param {string} options.tempDir
 * @param {function} [callback] optional
 */
module.exports = function prep(pbfFile, outputFile, options, callback) {
  if (!options) {
    options = {};
  }
  options.tempDir = options.tempDir || '/tmp';

  fs.ensureDirSync(options.tempDir);

  var o5mFile = path.join(options.tempDir, 'original.o5m');
  var filteredOsmFile = path.join(options.tempDir, 'filtered.osm');

  async.series([
      convert.bind(null, pbfFile, o5mFile),
      filterAdminBoundaries.bind(null, o5mFile, filteredOsmFile),
      convert.bind(null, filteredOsmFile, outputFile)
    ],
    function (code) {
      if (callback && typeof callback === 'function') {
        callback(code);
      }
      else {
        if (code) {
          console.error(colors.red('[Error]:'), 'Process exited with error code ' + code);
          process.exit(code);
        }
        else {
          console.log(colors.green('All done!'));
        }
      }
    });
};

function convert(inputFile, outputFile, callback) {
  spawn('osmconvert', [ inputFile, '-o=' + outputFile ], callback);
}

function filterAdminBoundaries(o5mFile, outputFile, callback) {
  spawn( 'osmfilter', [ o5mFile, '--keep=boundary=administrative', '-o=' + outputFile ], callback );
}