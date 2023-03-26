const { Command } = require('@sapphire/framework');
const ms = require('ms');
const { embed, resolveKey } = require('../../lib/structures/exports');
const guildSchema = require('../../schema/guild');
const PrayerData = require('../../data/prayer.json').countries;
class PrayerCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'prayer',
			description: 'تحديد التذكير بأوقات الصلاة/Setting the reminder for prayer times',
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
					name: 'الدولةcountry',
					type: 'STRING',
					description: `الدولة المراد تحديد أوقات الصلاة لها/Country to set prayer times for`,
					required: true,
					autocomplete: true
				},
				{
					name: 'المنشنmention',
					type: 'ROLE',
					description: `المنشن المراد تحديده للتذكير بأوقات الصلاة/Mention to set for prayer times`,
					required: false
				}
			]
		});
	}
	/**
	 *
	 * @param {Command.AutocompleteInteraction} interaction
	 */
	async autocompleteRun(interaction) {
		const focused = interaction.options.getFocused(true);
		let language = (await guildSchema.findOne({ guildID: interaction.guild.id }).then((res) => res.language)) || 'AR';
		if (focused.name == 'الدولةcountry') {
			const filtered = PrayerData.filter(
				(Prayer) => Prayer.name.includes(focused.value) || Prayer.en_name.toLowerCase().includes(focused.value.toLowerCase())
			).slice(0, 25);
			await interaction.respond(filtered.map((a) => ({ name: `${language === 'AR' ? a.name : a.en_name}`, value: a.country.toString() })));
		}
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
		const prayer = interaction.options.getChannel('الشاتchannel');
		const country = interaction.options.getString('الدولةcountry');
		let mention = interaction.options.getRole('المنشنmention');
		if (mention && interaction.guild.roles.everyone.id === mention.id)
			mention = {
				id: '@everyone'
			};
		else if (mention)
			mention = {
				id: `<@&${mention.id}>`
			};
		if (!prayer || !country)
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
		const FindWebhook = await interaction.guild.channels.cache.get(prayer.id).fetchWebhooks();
		const FindPrayer = FindGuild.prayer.find((x) => x.channelID === prayer.id);
		if (!FindPrayer) {
			const CreateWebhook = await prayer
				.createWebhook(`${FindGuild.language == 'AR' ? 'حان موعد الصلاة' : `it's time to pray`}`, {
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
						prayer: {
							channelID: prayer.id,
							country: country,
							webhookID: CreateWebhook.id,
							webhookToken: CreateWebhook.token,
							mention: mention ? mention.id : null
						}
					}
				}
			);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:new', {
					replace: {
						chat: `<#${prayer.id}>`
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
		} else if (!FindWebhook.find((x) => x.id === FindPrayer.webhookID)) {
			const CreateWebhook = await prayer
				.createWebhook(`${FindGuild.language == 'AR' ? 'حان موعد الصلاة' : `it's time to pray`}`, {
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
					'prayer.channelID': prayer.id
				},
				{
					$set: {
						'prayer.$.webhookID': CreateWebhook.id,
						'prayer.$.webhookToken': CreateWebhook.token,
						'prayer.$.mention': mention ? mention.id : null,
						'prayer.$.country': country
					}
				}
			);
			embed(
				interaction,
				await resolveKey(interaction, 'commands:sync', {
					replace: {
						chat: `<#${prayer.id}>`
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
		} else {
			if (country || mention) {
				await guildSchema.findOneAndUpdate(
					{
						guildID: interaction.guildId,
						'prayer.channelID': prayer.id
					},
					{
						$set: {
							'prayer.$.country': country,
							'prayer.$.mention': mention ? mention.id : null
						}
					}
				);
				embed(
					interaction,
					await resolveKey(interaction, 'commands:sync', {
						replace: {
							chat: `<#${prayer.id}>`
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
			} else {
				embed(
					interaction,
					await resolveKey(interaction, 'commands:already', {
						replace: {
							chat: `<#${prayer.id}>`
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

exports.PrayerCommand = PrayerCommand;
