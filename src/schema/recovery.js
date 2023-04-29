const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true
	},
	requester: String,
	voiceID: String,
	key: String
});
module.exports = mongoose.model('recoverytest', Schema);
