const { Listener, container } = require('@sapphire/framework');

class TrackEndEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'trackEnd'
		});
	}

	/**
	 *
	 * @param {import('erela.js').Player} player
	 * @param {import('erela.js').Track} track
	 * @param {import('erela.js').TrackEndEvent} playload
	 */
	async run(player, track, playload) {
		try {
			player.MessagePlayer.delete().catch(() => {});
			player.MessagePlayercollector.stop();
		} catch {}
	}
}

exports.TrackEndEvent = TrackEndEvent;
