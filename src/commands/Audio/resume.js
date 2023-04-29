const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');

class ResumeCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'resume',
			description: 'استئناف الصوت/resume audio',
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
		if (!player.paused) {
			embed(
				interaction,
				await resolveKey(interaction, 'commands:resume_already_resume', {
					replace: {
						emoji: client.emoji.warn
					}
				}),
				'p-',
				{
					interaction: {
						stats: true
					}
				}
			);
			return;
		}
		player.pause(false);
		return embed(
			interaction,
			await resolveKey(interaction, 'commands:resume_answer', {
				replace: {
					emoji: client.emoji.audio.pause
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

exports.ResumeCommand = ResumeCommand;
