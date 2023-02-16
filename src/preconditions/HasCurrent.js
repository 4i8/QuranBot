const { AllFlowsPrecondition } = require('@sapphire/framework');
const { Player } = require('erela.js');
const { resolveKey } = require('../lib/structures/exports');

class HasCurrentPrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		return await this.doCheck(interaction.guildId);
	}

	/**
	 * @param {import('discord.js').ContextMenuInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		return await this.doCheck(interaction.guildId);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	async messageRun(message) {
		return await this.doCheck(message.guildId);
	}

	/**
	 * @param {import('discord.js').Snowflake} guildId
	 */
	async doCheck(guildId) {
		/** @type {Player | undefined} */
		const player = this.container.client.manager.get(guildId);
		if (player && player.queue) {
			if (player.queue.current) {
				return this.ok();
			} else {
				return this.error({ message: await resolveKey({ guild: guildId }, 'preconditions:has_current') });
			}
		} else return this.error({ message: await resolveKey({ guild: guildId }, 'preconditions:has_current') });
	}
}

module.exports = {
	HasCurrentPrecondition
};
