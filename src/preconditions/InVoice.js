const { AllFlowsPrecondition } = require('@sapphire/framework');
const { resolveKey } = require('../lib/structures/exports');

class InVoicePrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		return await this.doInVoiceCheck(interaction.member);
	}

	/**
	 * @param {import('discord.js').ContextMenuInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		return await this.doInVoiceCheck(interaction.member);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	async messageRun(message) {
		return await this.doInVoiceCheck(message.member);
	}

	/**
	 * @param {import('discord.js').GuildMember} member
	 */
	async doInVoiceCheck(member) {
		return member.voice.channel ? this.ok() : this.error({
			message: await resolveKey(member, 'preconditions:in_voice')
		});
	}
}

module.exports = {
	InVoicePrecondition
};
