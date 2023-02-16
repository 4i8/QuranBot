const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');
const guildSchema = require('../../schema/guild');

class LoopCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'loop',
			description: 'تكرار الصوت/loop',
			preconditions: ['GuildOnly', 'HasPerm', 'InVoice', 'SameVoice', 'HasRecovery', 'HasPlayer']
		});
	}

	/**
	 *
	 * @param {Command.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			dm_permission: false
		});
	}
	/**
	 *
	 * @param {Command.ChatInputInteraction} interaction
	 */
	async chatInputRun(interaction) {
		await interaction.deferReply({
			ephemeral: false
		});
		const { client } = this.container;
		let player = client.manager.get(interaction.guildId);
		await guildSchema.findOneAndUpdate(
			{
				guildID: interaction.guildId
			},
			{
				$set: {
					loop: player.queueRepeat ? false : true
				}
			},
			{
				upsert: true
			}
		);
		player.setQueueRepeat(player.queueRepeat ? false : true);
		embed(
			interaction,
			`${await resolveKey(interaction, 'commands:loop_answer', {
				replace: {
					onOrOff: player.queueRepeat ? 'On' : 'Off',
					emoji: player.queueRepeat ? client.emoji.audio.on : client.emoji.audio.off
				}
			})}`,
			'p-',
			{
				interaction: {
					stats: true
				}
			}
		);
	}
}

exports.LoopCommand = LoopCommand;
