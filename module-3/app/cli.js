const parse = require('minimist')(process.argv.slice(2));
const command = parse._[0];
const resource = parse._[1];
const file_acl= parse._[2];

module.exports = { command, resource, file_acl };
