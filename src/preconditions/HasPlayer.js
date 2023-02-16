const { AllFlowsPrecondition } = require('@sapphire/framework');
const { Player } = require('erela.js');
const { resolveKey } = require('../lib/structures/exports');

class HasPlayerPrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		return await this.doPlayerCheck(interaction.guild);
	}

	/**
	 * @param {import('discord.js').ContextMenuInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		return await this.doPlayerCheck(interaction.guild);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	async messageRun(message) {
		return await this.doPlayerCheck(message.guild);
	}

	/**
	 * @param {import('discord.js').Guild} guild
	 */
	async doPlayerCheck(guild) {
		/** @type {Player | undefined} */
		const player = this.container.client.manager.get(guild?.id);
		return player && player.state === 'CONNECTED'
			? this.ok()
			: this.error({ message: await resolveKey({ guild: guild }, 'preconditions:has_player') });
	}
}

module.exports = {
	HasPlayerPrecondition
};
