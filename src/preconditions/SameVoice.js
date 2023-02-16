const { AllFlowsPrecondition } = require('@sapphire/framework');
const { resolveKey } = require('../lib/structures/exports');

class SameVoicePrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		return await this.doSameVoiceCheck(interaction.member, interaction.guild.me);
	}

	/**
	 * @param {import('discord.js').ContextMenuInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		return await this.doSameVoiceCheck(interaction.member, interaction.guild.me);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	async messageRun(message) {
		return await this.doSameVoiceCheck(message.member, message.guild.me);
	}

	/**
	 * @param {import('discord.js').GuildMember} user_member
	 * @param {import('discord.js').GuildMember} clinet_member
	 */
	async doSameVoiceCheck(user_member, clinet_member) {
		if (clinet_member.voice.channel &&
			user_member.voice.channel !== clinet_member.voice.channel) {
			return this.error({
				message: await resolveKey(user_member, 'preconditions:same_voice')
			});
		} else return this.ok();
	}
}

module.exports = {
	SameVoicePrecondition
};
