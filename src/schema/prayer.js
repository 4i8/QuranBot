const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
	country: {
		type: String,
		required: true
	},
	prayer: {
		type: Array,
		default: []
	},
	blacklist: {
		type: Array,
		default: []
	}
});
module.exports = mongoose.model('prayer', Schema);
