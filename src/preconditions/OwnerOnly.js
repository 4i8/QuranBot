const { AllFlowsPrecondition } = require('@sapphire/framework');
const { settings } = require('../config.json');

class OwnerOnlyPrecondition extends AllFlowsPrecondition {
	#message = "This command can only be used by the owner.";
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	chatInputRun(interaction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	/**
	 * @param {import('discord.js').ContextMenuInteraction} interaction
	 */
	contextMenuRun(interaction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	messageRun(message) {
		return this.doOwnerCheck(message.author.id);
	}

	/**
	 * @param {import('discord.js').Snowflake} userId
	 */
	doOwnerCheck(userId) {
		return settings.Owner_ID.includes(userId) ? this.ok() : this.error({ message: this.#message });
	}
}

module.exports = {
	OwnerOnlyPrecondition
};
