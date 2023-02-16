const { AllFlowsPrecondition } = require('@sapphire/framework');
const { resolveKey } = require('../lib/structures/exports');

class GuildOnlyPrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		return await this.GuildOnly(interaction.guild);
	}

	/**
	 * @param {import('discord.js').ContextMenuInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		return await this.GuildOnly(interaction.guild);
	}
	/**
	 * @param {import('discord.js').Message} message
	 */
	async messageRun(message) {
		return await this.GuildOnly(message.guild);
	}

	/**
	 * @param {import('discord.js').Guild} guild
	 */
	async GuildOnly(guild) {
		return guild === null
			? this.error({
				message: await resolveKey({ guild: guild }, 'preconditions:guild_only')
			})
			: this.ok();
	}
}

module.exports = {
	GuildOnlyPrecondition
};
