const { Listener, container } = require('@sapphire/framework');

class QueueEndEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'queueEnd'
		});
	}

	/**
	 *
	 * @param {import('erela.js').Player} player
	 * @returns
	 */
	async run(player) {
		try {
			player.MessagePlayer.delete().catch(() => {});
			player.MessagePlayercollector.stop();
		} catch {}
	}
}

exports.QueueEndEvent = QueueEndEvent;
