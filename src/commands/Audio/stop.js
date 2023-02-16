const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');

class StopCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'stop',
			description: 'إيقاف الصوت/stop audio',
			preconditions: ['GuildOnly', 'HasPerm', 'HasRecovery']
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
		if (player) {
			player?.destroy();
		}
		if (process.cache.tacs[interaction.guildId]) {
			process.cache.tacs[interaction.guildId].kill();
		}
		delete process.cache.await[interaction.guildId];
		return embed(
			interaction,
			await resolveKey(interaction, 'commands:stop_answer', {
				replace: {
					emoji: client.emoji.audio.stop
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

exports.StopCommand = StopCommand;
