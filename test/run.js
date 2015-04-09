var tape = require('tape');
var common = {};

var tests = [
  require('./build'),
  require('./slice'),
  require('./prep'),
  require('./create')
];

tests.map(function(t) {
  t.all(tape, common);
});