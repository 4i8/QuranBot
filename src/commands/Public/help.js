const { Command } = require('@sapphire/framework');
const { embed, resolveKey } = require('../../lib/structures/exports');

class HelpCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'help',
			description: 'معرفة خريطة البوت / Know bot map'
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
		let components = [
			{
				type: 1,
				components: [
					{
						type: 2,
						style: 5,
						label: 'الدعم الفني/Support',
						url: client.config.Links.server
					},
					{
						type: 2,
						style: 5,
						label: 'دعوة/Invite',
						url: client.config.Links.invite
					}
				]
			}
		];
		embed(interaction, await resolveKey(interaction, 'commands:help'), 'p-', {
			interaction: {
				stats: true
			},
			components: components
		});
	}
}

exports.HelpCommand = HelpCommand;
