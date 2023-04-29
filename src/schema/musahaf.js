const mongoose = require('mongoose');

const Schema = mongoose.Schema({
	userID: String,
	page: {
		type: Number,
		default: 1
	}
});

module.exports = mongoose.model('musahaf', Schema);
