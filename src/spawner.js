var colors = require('colors');
var spawn = require('child_process').spawn;

/**
 * Spawn a child process with the given command and args.
 * Pipe all child process output to console.
 * If process exits with error code, pass the error up to the caller.
 *
 * @param {string} command
 * @param {[]} args
 * @param {function} callback (exit_code)
 * @param {[]} [stdio] could be pipe, ignore, inherit or an array of those [stdin, stdout, stderr]
 */
module.exports = function spawnChild(command, args, callback, stdio) {

  console.log(colors.blue('[executing]'), command, JSON.stringify(args));

  stdio = stdio || 'inherit';

  var proc = spawn(command, args, { stdio: stdio });

  proc.on('close', function (code) {
    if (code !== 0) {
      if (callback && typeof callback === 'function') {
        callback(code || 100); // code could be null, which indicates error
      }
      else {
        console.error('Child process exited with error code ', code);
        process.exit(code || 100); // code could be null, which indicates error
      }
    }
    else {
      if (callback && typeof callback === 'function') {
        callback();
      }
      else {
        console.log(colors.green('All done!'));
      }
    }
  });
};