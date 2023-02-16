const { Command } = require('@sapphire/framework');
const ms = require('ms');
const { embed, SetInterval, resolveKey } = require('../../lib/structures/exports');
const { StartKhutma } = require('../../lib/utils/extc');
const guildSchema = require('../../schema/guild');

class KhutmaCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'khutma',
			description: 'تحديد الختمة/Setting Khutma',
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
					description: `وقت الارسال المدة الافتراضية ساعتين/Sending time :  5m , 1h , 1d default 2 hours`,
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
		const khutma = interaction.options.getChannel('الشاتchannel');
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
		if (!khutma)
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
		if (khutma && !time) {
			time = '2h';
			istime = true;
		}
		if (time && (ms(time) > ms('2d') || ms(time) < ms('5m')) && khutma) {
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
		const FindWebhook = await interaction.guild.channels.cache.get(khutma.id).fetchWebhooks();
		const FindKhutma = FindGuild.khutma.find((x) => x.channelID === khutma.id);
		if (FindKhutma && istime) {
			time = ms(FindKhutma?.time) || '2h';
		}
		if (!FindKhutma) {
			const CreateWebhook = await khutma
				.createWebhook(`${FindGuild.language == 'AR' ? 'ختمة' : 'Khutma'}`, {
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
						khutma: {
							channelID: khutma.id,
							time: ms(time) ? ms(time) : ms('2h'),
							webhookID: CreateWebhook.id,
							webhookToken: CreateWebhook.token,
							page: 0,
							color: color ? color : client.config.colors.Primary
						}
					}
				}
			);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:new', {
					replace: {
						chat: `<#${khutma.id}>`
					}
				}),
				'p-',
				{
					interaction: {
						stats: true
					}
				}
			);
			StartKhutma({
				guildID: interaction.guildId,
				time: ms(time) ? ms(time) : FindKhutma?.time ? FindKhutma.time : ms('2h'),
				webhookID: CreateWebhook.id,
				webhookToken: CreateWebhook.token,
				channelID: khutma.id
			});
			return;
		} else if (!FindWebhook.find((x) => x.id === FindKhutma.webhookID)) {
			//Clear Khutma
			if (SetInterval().key[FindKhutma.webhookToken]) {
				SetInterval().clear(FindKhutma.webhookToken);
			}
			//
			const CreateWebhook = await khutma
				.createWebhook(`${FindGuild.language == 'AR' ? 'ختمة' : 'Khutma'}`, {
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
					'khutma.channelID': khutma.id
				},
				{
					$set: {
						'khutma.$.webhookID': CreateWebhook.id,
						'khutma.$.webhookToken': CreateWebhook.token,
						'khutma.$.time': ms(time) ? ms(time) : FindKhutma?.time ? FindKhutma.time : ms('2h'),
						'khutma.$.color': color ? color : FindKhutma?.color ? FindKhutma.color : client.config.colors.Primary
					}
				}
			);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:sync', {
					replace: {
						chat: `<#${khutma.id}>`
					}
				}),
				'p-',
				{
					interaction: {
						stats: true
					}
				}
			);
			StartKhutma({
				guildID: interaction.guildId,
				time: ms(time) ? ms(time) : FindKhutma?.time ? FindKhutma.time : ms('2h'),
				webhookID: CreateWebhook.id,
				webhookToken: CreateWebhook.token,
				channelID: khutma.id
			});
			return;
		} else {
			if (time || color) {
				await guildSchema.findOneAndUpdate(
					{
						guildID: interaction.guildId,
						'khutma.channelID': khutma.id
					},
					{
						$set: {
							'khutma.$.time': ms(time) ? ms(time) : FindKhutma?.time ? FindKhutma.time : ms('25m'),
							'khutma.$.color': color ? color : FindKhutma?.color ? FindKhutma.color : client.config.colors.Primary
						}
					}
				);
				embed(
					interaction,
					await resolveKey(interaction, 'commands:sync', {
						replace: {
							chat: `<#${khutma.id}>`
						}
					}),
					'p-',
					{
						interaction: {
							stats: true
						}
					}
				);
				//Clear Khutma
				if (SetInterval().key[FindKhutma.webhookToken]) {
					SetInterval().clear(FindKhutma.webhookToken);
				}
				//
				StartKhutma({
					guildID: interaction.guildId,
					time: ms(time) ? ms(time) : FindKhutma?.time ? FindKhutma.time : ms('2h'),
					webhookID: FindKhutma.webhookID,
					webhookToken: FindKhutma.webhookToken,
					channelID: khutma.id
				});
				return;
			} else {
				embed(
					interaction,
					await resolveKey(interaction, 'commands:already', {
						replace: {
							chat: `<#${khutma.id}>`
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

exports.KhutmaCommand = KhutmaCommand;
