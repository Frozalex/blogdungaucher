// @motion-canvas/vite-plugin 3.17.2 only uses sync() and isDynamicPattern().
// Keep that interface while removing the unpatched braces dependency chain.
const { glob, globSync, isDynamicPattern } = require('tinyglobby');
module.exports = Object.assign(
  (patterns, options) => glob(patterns, options),
  { sync: globSync, isDynamicPattern },
);
