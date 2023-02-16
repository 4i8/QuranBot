require('@sapphire/plugin-logger/register');
require('@sapphire/plugin-api/register');
const { createColors } = require('colorette');
const { inspect } = require('util');

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
createColors({ useColor: true });
