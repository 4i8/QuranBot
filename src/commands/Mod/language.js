const { Command } = require('@sapphire/framework');
const { embed } = require('../../lib/structures/exports');
const guildSchema = require('../../schema/guild');

class LanguageCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'language',
			description: 'تغير اللغة/Change language',
			preconditions: ['GuildOnly', 'HasPerm', 'HasPermUser']
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
			dm_permission: false,
			options: [
				{
					name: 'languageاللغة',
					type: 'STRING',
					required: true,
					description: `اللغة/ Language : العربية , en , fr`,
					choices: [
						{
							name: 'العربية',
							value: 'AR'
						},
						{
							name: 'English',
							value: 'EN'
						},
						{
							name: 'French',
							value: 'FR'
						}
					]
				}
			]
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
		const language = interaction.options.getString('languageاللغة');
		await guildSchema.findOneAndUpdate(
			{
				guildID: interaction.guildId
			},
			{
				$set: {
					language: language
				}
			},
			{
				upsert: true
			}
		);
		embed(interaction, `${language === 'AR' ? 'العربية' : language}`, 'p', {
			interaction: {
				stats: true
			}
		});
	}
}

exports.LanguageCommand = LanguageCommand;
