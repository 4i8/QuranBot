const { Listener, container } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class TrackErrorEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'trackError'
		});
	}

	/**
	 *
	 * @param {import('erela.js').Player} player
	 * @param {import('erela.js').Track} track
	 * @param {import('erela.js').TrackExceptionEvent} playload
	 */
	async run(player, track, playload) {
		this.container.logger.error(`Error[${player.guild}]`);
		hook(`Error[${player.guild}]`).error();
		if (!player.voiceChannel) player.destroy();
	}
}

exports.TrackErrorEvent = TrackErrorEvent;
