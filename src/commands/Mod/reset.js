const { Command } = require('@sapphire/framework');
const { embed, SetInterval, resolveKey } = require('../../lib/structures/exports');
const guildSchema = require('../../schema/guild');

class ResetCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'reset',
			description: 'إعادة تعيين لشات /Reset chat',
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
		//Basic settings
		const FindGuild = await guildSchema.findOne({
			guildID: interaction.guildId
		});
		const FindAzkar = FindGuild.azkar.find((x) => x.channelID === interaction.channelId);
		const FindKhutma = FindGuild.khutma.find((x) => x.channelID === interaction.channelId);
		const FindPrayer = FindGuild.prayer.find((x) => x.channelID === interaction.channelId);
		if (!FindAzkar && !FindKhutma && !FindPrayer)
			return embed(interaction, await resolveKey(interaction, 'commands:reset_notfound'), `w`, {
				interaction: {
					stats: true
				}
			});
		if (FindAzkar) {
			await guildSchema.findOneAndUpdate(
				{
					guildID: interaction.guildId,
					'azkar.channelID': interaction.channelId
				},
				{
					$set: {
						'azkar.$.channelID': null
					}
				}
			);
			SetInterval().clear(FindAzkar.webhookToken);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:reset_success', {
					replace: {
						chat: `<#${interaction.channelId}>`
					}
				}),
				`e-`,
				{
					interaction: {
						stats: true
					}
				}
			);
			return;
		} else if (FindKhutma) {
			await guildSchema.findOneAndUpdate(
				{
					guildID: interaction.guildId,
					'khutma.channelID': interaction.channelId
				},
				{
					$set: {
						'khutma.$.channelID': null
					}
				}
			);
			SetInterval().clear(FindKhutma.webhookToken);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:reset_success', {
					replace: {
						chat: `<#${interaction.channelId}>`
					}
				}),
				`e-`,
				{
					interaction: {
						stats: true
					}
				}
			);
		} else if (FindPrayer) {
			await guildSchema.findOneAndUpdate(
				{
					guildID: interaction.guildId,
					'prayer.channelID': interaction.channelId
				},
				{
					$set: {
						'prayer.$.channelID': null
					}
				}
			);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:reset_success', {
					replace: {
						chat: `<#${interaction.channelId}>`
					}
				}),
				`e-`,
				{
					interaction: {
						stats: true
					}
				}
			);
		}
	}
}

exports.ResetCommand = ResetCommand;
