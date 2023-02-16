const { Command } = require('@sapphire/framework');
const ms = require('ms');
const { embed, SetInterval, resolveKey } = require('../../lib/structures/exports');
const { StartAzkar } = require('../../lib/utils/extc');
const guildSchema = require('../../schema/guild');

class AzkarCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'azkar',
			description: 'تحديد الاذكار/Setting azkar',
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
					name: 'الشاتchannel',
					type: 'CHANNEL',
					description: `القناة الكتابية/Text Channel`,
					required: true,
					channel_types: [0]
				},
				{
					name: 'الوقتtime',
					type: 'STRING',
					description: `وقت الارسال المدة الافتراضية 25 دقيقة/Sending time :  5m , 1h , 1d default 25 minutes`,
					required: false
				},
				{
					name: 'اللونcolor',
					type: 'STRING',
					description: `لون الامبد/Color Embed`,
					required: false
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
		//Basic settings
		const FindGuild = await guildSchema.findOne({
			guildID: interaction.guildId
		});
		const azkar = interaction.options.getChannel('الشاتchannel');
		let time = interaction.options.getString('الوقتtime');
		let istime = false;
		let color = interaction.options.getString('اللونcolor');
		if (color) {
			if (!color.startsWith('#')) color = `#${color}`;
			if (!/^#[0-9A-F]{6}$/i.test(color)) {
				return embed(
					interaction,
					await resolveKey(interaction, 'commands:wrong_options', {
						replace: {
							emoji: client.emoji.error
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
		if (!azkar)
			return embed(
				interaction,
				await resolveKey(interaction, 'commands:wrong_options', {
					replace: {
						emoji: client.emoji.error
					}
				}),
				`e-`,
				{
					interaction: {
						stats: true
					}
				}
			);
		if (azkar && !time) {
			time = '25m';
			istime = true;
		}
		if (time && (ms(time) > ms('2d') || ms(time) < ms('5m')) && azkar) {
			return embed(interaction, await resolveKey(interaction, `${ms(time) > ms('2d') ? `commands:time_day` : `commands:time_minutes`}`), `e`, {
				interaction: {
					stats: true
				}
			});
		} else if (time && !ms(time)) {
			return embed(
				interaction,
				await resolveKey(interaction, 'commands:wrong_options', {
					replace: {
						emoji: client.emoji.error
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
		const FindWebhook = await interaction.guild.channels.cache.get(azkar.id).fetchWebhooks();
		const FindAzkar = FindGuild.azkar.find((x) => x.channelID === azkar.id);
		if (FindAzkar && istime) {
			time = ms(FindAzkar?.time) || '25m';
		}
		if (!FindAzkar) {
			const CreateWebhook = await azkar
				.createWebhook(`${FindGuild.language == 'AR' ? 'أذكار' : 'Azkar'}`, {
					avatar: client.user.displayAvatarURL({
						dynamic: true
					})
				})
				.catch((err) => {
					return {
						code: err?.code ? err.code : false,
						status: true
					};
				});
			if (CreateWebhook?.status) {
				return embed(
					interaction,
					`${
						CreateWebhook.code === 30007
							? await resolveKey(interaction, 'commands:webhookerror_30007')
							: await resolveKey(interaction, 'commands:webhookerror')
					}`,
					`e`,
					{
						interaction: {
							stats: true
						}
					}
				);
			}
			await guildSchema.findOneAndUpdate(
				{
					guildID: interaction.guildId
				},
				{
					$push: {
						azkar: {
							channelID: azkar.id,
							time: ms(time) ? ms(time) : ms('25m'),
							webhookID: CreateWebhook.id,
							webhookToken: CreateWebhook.token,
							color: color ? color : client.config.colors.Primary
						}
					}
				}
			);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:new', {
					replace: {
						chat: `<#${azkar.id}>`
					}
				}),
				'p-',
				{
					interaction: {
						stats: true
					}
				}
			);
			StartAzkar({
				guildID: interaction.guildId,
				time: ms(time) ? ms(time) : FindAzkar?.time ? FindAzkar.time : ms('25m'),
				webhookID: CreateWebhook.id,
				webhookToken: CreateWebhook.token
			});
			return;
		} else if (!FindWebhook.find((x) => x.id === FindAzkar.webhookID)) {
			//Clear Azkar
			if (SetInterval().key[FindAzkar.webhookToken]) {
				SetInterval().clear(FindAzkar.webhookToken);
			}
			//
			const CreateWebhook = await azkar
				.createWebhook(`${FindGuild.language == 'AR' ? 'أذكار' : 'Azkar'}`, {
					avatar: client.user.displayAvatarURL({
						dynamic: true
					})
				})
				.catch((err) => {
					return {
						code: err?.code ? err.code : false,
						status: true
					};
				});
			if (CreateWebhook?.status) {
				return embed(
					interaction,
					`${
						CreateWebhook.code === 30007
							? await resolveKey(interaction, 'commands:webhookerror_30007')
							: await resolveKey(interaction, 'commands:webhookerror')
					}`,
					`e`,
					{
						interaction: {
							stats: true
						}
					}
				);
			}
			await guildSchema.findOneAndUpdate(
				{
					guildID: interaction.guildId,
					'azkar.channelID': azkar.id
				},
				{
					$set: {
						'azkar.$.webhookID': CreateWebhook.id,
						'azkar.$.webhookToken': CreateWebhook.token,
						'azkar.$.time': ms(time) ? ms(time) : FindAzkar?.time ? FindAzkar.time : ms('25m'),
						'azkar.$.color': color ? color : FindAzkar?.color ? FindAzkar.color : client.config.colors.Primary
					}
				}
			);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:sync', {
					replace: {
						chat: `<#${azkar.id}>`
					}
				}),
				'p-',
				{
					interaction: {
						stats: true
					}
				}
			);
			StartAzkar({
				guildID: interaction.guildId,
				time: ms(time) ? ms(time) : FindAzkar?.time ? FindAzkar.time : ms('25m'),
				webhookID: CreateWebhook.id,
				webhookToken: CreateWebhook.token
			});
			return;
		} else {
			if (time || color) {
				await guildSchema.findOneAndUpdate(
					{
						guildID: interaction.guildId,
						'azkar.channelID': azkar.id
					},
					{
						$set: {
							'azkar.$.time': ms(time) ? ms(time) : FindAzkar?.time ? FindAzkar.time : ms('25m'),
							'azkar.$.color': color ? color : FindAzkar?.color ? FindAzkar.color : client.config.colors.Primary
						}
					}
				);
				embed(
					interaction,
					await resolveKey(interaction, 'commands:sync', {
						replace: {
							chat: `<#${azkar.id}>`
						}
					}),
					'p-',
					{
						interaction: {
							stats: true
						}
					}
				);
				//Clear Azkar
				if (SetInterval().key[FindAzkar.webhookToken]) {
					SetInterval().clear(FindAzkar.webhookToken);
				}
				//
				StartAzkar({
					guildID: interaction.guildId,
					time: ms(time) ? ms(time) : FindAzkar?.time ? FindAzkar.time : ms('25m'),
					webhookID: FindAzkar.webhookID,
					webhookToken: FindAzkar.webhookToken
				});
				return;
			} else {
				embed(
					interaction,
					await resolveKey(interaction, 'commands:already', {
						replace: {
							chat: `<#${azkar.id}>`
						}
					}),
					'e',
					{
						interaction: {
							stats: true
						}
					}
				);
			}
		}
		return;
	}
}

exports.AzkarCommand = AzkarCommand;
