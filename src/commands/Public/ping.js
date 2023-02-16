const { Command } = require('@sapphire/framework');
const { embed } = require('../../lib/structures/exports');

class HelpCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'ping',
			description: 'سرعة اتصال/ Ping'
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
		const { client } = this.container;
		await interaction.deferReply({
			ephemeral: false
		});
		embed(interaction, `\`${Math.round(client.ws.ping)}\``, 'p', {
			interaction: {
				stats: true
			}
		});
	}
}

exports.HelpCommand = HelpCommand;
