function extra(
	res,
	options = {
		voice: null,
		text: null,
		title: null,
		recovery: true
	}
) {
	res.tracks[0].voice = options.voice;
	res.tracks[0].text = options.text;
	res.tracks[0].title = options.title;
	res.tracks[0].recovery = options.recovery;
}
module.exports = extra;
