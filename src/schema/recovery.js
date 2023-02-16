const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true
	},
	latest: {
		type: Array,
		default: []
	},
	key: {
		type: String,
		default: 'latest'
	}
});
module.exports = mongoose.model('recovery', Schema);
