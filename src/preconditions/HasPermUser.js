const { AllFlowsPrecondition } = require('@sapphire/framework');
const { Player } = require('erela.js');
const { resolveKey } = require('../lib/structures/exports');
const { settings } = require('../config.json');

class HasPermPrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		return await this.doCheck(interaction);
	}

	/**
	 * @param {import('discord.js').ContextMenuInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		return await this.doCheck(interaction);
	}
	/**
	 * @param {import('discord.js').Message} message
	 */
	async messageRun(message) {
		return await this.doCheck(message);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	async doCheck(message) {
		const { client } = this.container;
		return !message.channel.permissionsFor(message.member).has(['MANAGE_GUILD']) && !settings.Owner_ID.includes(message.member.user.id)
			? this.error({ message: await resolveKey(message, 'preconditions:has_perm_user', { replace: { missing: `\`Manage Server\`` } }) })
			: this.ok();
	}
}

const readablePermissions = {
	ADD_REACTIONS: 'Add Reactions',
	ADMINISTRATOR: 'Administrator',
	ATTACH_FILES: 'Attach Files',
	BAN_MEMBERS: 'Ban Members',
	CHANGE_NICKNAME: 'Change Nickname',
	CONNECT: 'Connect',
	CREATE_INSTANT_INVITE: 'Create Instant Invite',
	CREATE_PRIVATE_THREADS: 'Create Private Threads',
	CREATE_PUBLIC_THREADS: 'Create Public Threads',
	DEAFEN_MEMBERS: 'Deafen Members',
	EMBED_LINKS: 'Embed Links',
	KICK_MEMBERS: 'Kick Members',
	MANAGE_CHANNELS: 'Manage Channels',
	MANAGE_EMOJIS_AND_STICKERS: 'Manage Emojis and Stickers',
	MANAGE_EVENTS: 'Manage Events',
	MANAGE_GUILD: 'Manage Server',
	MANAGE_MESSAGES: 'Manage Messages',
	MANAGE_NICKNAMES: 'Manage Nicknames',
	MANAGE_ROLES: 'Manage Roles',
	MANAGE_THREADS: 'Manage Threads',
	MANAGE_WEBHOOKS: 'Manage Webhooks',
	MENTION_EVERYONE: 'Mention Everyone',
	MODERATE_MEMBERS: 'Moderate Members',
	MOVE_MEMBERS: 'Move Members',
	MUTE_MEMBERS: 'Mute Members',
	PRIORITY_SPEAKER: 'Priority Speaker',
	READ_MESSAGE_HISTORY: 'Read Message History',
	REQUEST_TO_SPEAK: 'Request to Speak',
	SEND_MESSAGES_IN_THREADS: 'Send Messages in Threads',
	SEND_MESSAGES: 'Send Messages',
	SEND_TTS_MESSAGES: 'Send TTS Messages',
	SPEAK: 'Speak',
	START_EMBEDDED_ACTIVITIES: 'Start Activities',
	STREAM: 'Stream',
	USE_APPLICATION_COMMANDS: 'Use Application Commands',
	USE_EXTERNAL_EMOJIS: 'Use External Emojis',
	USE_EXTERNAL_STICKERS: 'Use External Stickers',
	USE_PRIVATE_THREADS: 'Use Private Threads',
	USE_PUBLIC_THREADS: 'Use Public Threads',
	USE_VAD: 'Use Voice Activity',
	VIEW_AUDIT_LOG: 'View Audit Log',
	VIEW_CHANNEL: 'Read Messages',
	VIEW_GUILD_INSIGHTS: 'View Guild Insights'
};

module.exports = {
	HasPermPrecondition
};
