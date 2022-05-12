const path = require("path")

// console.log(require.main.filename);
// console.log(path.dirname(require.main.filename));

module.exports = path.dirname(require.main.filename) // Exports root dir path
