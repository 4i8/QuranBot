const { AllFlowsPrecondition } = require('@sapphire/framework');
const { resolveKey } = require('../lib/structures/exports');

class HasRecoveryPrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		return await this.HasRecoveryCheck(interaction.guild);
	}

	/**
	 * @param {import('discord.js').ContextMenuInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		return await this.HasRecoveryCheck(interaction.guild);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	async messageRun(message) {
		return await this.HasRecoveryCheck(message.guild);
	}

	/**
	 * @param {import('discord.js').Guild} guild
	 */
	async HasRecoveryCheck(guild) {
		return !process.cache.recovery[guild?.id] && !process.cache.afk
			? this.ok()
			: this.error({
					message: await resolveKey({ guild: guild }, 'preconditions:has_recovery')
			  });
	}
}

module.exports = {
	HasRecoveryPrecondition
};
