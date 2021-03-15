const parse = require('minimist')(process.argv.slice(2));
const command = parse._[0];
const resource = parse._[1];
const dir_index = parse._[2];
const error = parse._[3];

module.exports = { command, resource, dir_index, error };
