const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');

class SkipCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'skip',
			description: 'تخطي الصوت/skip audio',
			preconditions: ['GuildOnly', 'HasPerm', 'InVoice', 'SameVoice', 'HasCurrent', 'HasRecovery', 'HasPlayer']
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
		player.stop();
		return embed(
			interaction,
			await resolveKey(interaction, 'commands:skip_answer', {
				replace: {
					emoji: client.emoji.audio.skip,
					title: player.queue.current.title
				}
			}),
			'p-',
			{
				interaction: {
					stats: true
				}
			}
		);
	}
}

exports.SkipCommand = SkipCommand;
