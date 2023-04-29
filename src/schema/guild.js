const mongoose = require('mongoose');

const Schema = mongoose.Schema({
	guildID: { type: String, required: true },
	language: { type: String, default: 'AR' },
	azkar: { type: Array, default: [] },
	khutma: { type: Array, default: [] },
	prayer: { type: Array, default: [] },
	volume: { type: Number, default: 100 },
	page: { type: Number, default: 1 },
	loop: { type: Boolean, default: false },
	remember: {
		loop: { type: Boolean, default: false }
	}
});

module.exports = mongoose.model('Guild', Schema);
