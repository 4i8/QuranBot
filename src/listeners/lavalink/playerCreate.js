const { Listener, container } = require('@sapphire/framework');

class PlayerCreateEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'playerCreate'
		});
	}

	run(player) {
		this.container.logger.info(`created[${player.guild}]`);
	}
}

exports.PlayerCreateEvent = PlayerCreateEvent;
