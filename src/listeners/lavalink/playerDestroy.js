const { Listener, container } = require('@sapphire/framework');

class PlayerDestroyEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'playerDestroy'
		});
	}

	run(player) {
		this.container.logger.info(`destroyed[${player.guild}]`);
		try {
			player.MessagePlayer.delete().catch(() => {});
			player.MessagePlayercollector.stop();
		} catch {}
		if (process.cache.tacs[player.guild]) {
			process.cache.tacs[player.guild].kill();
		}
		delete process.cache.await[player.guild];
	}
}

exports.PlayerDestroyEvent = PlayerDestroyEvent;
