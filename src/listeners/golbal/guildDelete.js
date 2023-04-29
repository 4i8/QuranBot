const { Listener } = require('@sapphire/framework');
const { Guild } = require('discord.js');
const { hook } = require('../../lib/utils/hook.js');
class guildDelete extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options
		});
	}

	/**
	 *
	 * @param {Guild} guild
	 */
	async run(guild) {
		const { client } = this.container;
		hook(`**Guild: \`${guild.id}\` - ${guild.name}\nmembers: ${guild.memberCount}**`).leave();
		const player = client.manager.get(guild.id);
		if (player) {
			player.destroy();
		}
		if (process.cache.tacs[guild.id]) {
			process.cache.tacs[guild.id].kill();
		}
	}
}

exports.guildDelete = guildDelete;
