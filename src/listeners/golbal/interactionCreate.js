const { Listener } = require('@sapphire/framework');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const Quran = require('../../data/surah/quran.js');
const { embed, resolveKey } = require('../../lib/structures/exports');
const musahafSchema = require('../../schema/musahaf');
const humanizeDuration = require('humanize-duration');
const { hook } = require('../../lib/utils/hook.js');
const guildSchema = require('../../schema/guild');
class interactionCreate extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options
		});
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async run(interaction) {
		if (interaction.isCommand() && interaction?.guildId) {
			const FindGuild = await guildSchema.findOne({ guildID: interaction.guild.id });
			if (!FindGuild) {
				const newGuild = new guildSchema({
					guildID: interaction.guild.id
				});
				await newGuild.save();
			}
			hook(
				`**cmd:\`${interaction.command.name}\`\nguild:\`${
					interaction.guildId !== null ? `${interaction.guildId} - ${interaction.guild.name}` : 'DM'
				}\`\nuser:\`${interaction.user.id} - ${interaction.user.tag}\`\n${
					!interaction.channel?.id ? '' : `channel:\`${interaction.channel.id} - ${interaction.channel.name}\``
				}**`,
				`}**`
			).commands();
		}
		if (!interaction.user.bot && interaction.isButton()) {
			let [key, value, user, page] = interaction.customId?.split('&-&');
			page = parseInt(page);
			if (key === 'quran' || key === 'pin') {
				await interaction.deferUpdate().catch(() => {});
			}
			if (key === 'pin') {
				await musahafSchema.findOneAndUpdate(
					{
						userID: interaction.user.id
					},
					{
						$set: {
							page: page
						}
					},
					{
						upsert: true
					}
				);
				return;
			}
			if (!(key == 'quran' && user == interaction.user.id)) return;
			if (process.cache.cooldowns[`${interaction.user.id}` + key]) {
				await interaction.deferReply({ ephemeral: true });
				return embed(
					interaction,
					await resolveKey(interaction, 'events:interaction_create_cooldown_warn', {
						replace: {
							time: `\`${humanizeDuration(process.cache.cooldowns[`${interaction.user.id}` + key].date - Date.now(), {
								language: 'ar'
							})}\``
						}
					}),
					'e',
					{
						interaction: {
							ephemeral: true,
							stats: true
						}
					}
				);
			}
			process.cache.cooldowns[`${interaction.user.id}` + key] = { date: Date.now() + 2000 };
			setTimeout(() => {
				delete process.cache.cooldowns[`${interaction.user.id}` + key];
			}, 2000);
			const { client } = this.container;
			//DataBase
			const data = await musahafSchema.findOne({ userID: interaction.user.id });
			if (!data) {
				const newData = new musahafSchema({
					userID: interaction.user.id
				});
				await newData.save();
			}
			const FindGuild = await guildSchema.findOne({
				guildID: interaction.guildId
			});
			switch (value) {
				case 'backward':
					page-- - 1;
					if (!Quran[page]) page = 604;
					let tl = FindGuild?.language || 'AR';
					const lang = require(`../../language_extc/${tl}.js`);
					let surah = Quran[page];
					let transliteration = `**•\`${tl == 'AR' ? surah.name : 'Surah ' + surah.transliteration_en}\`\n \n•${lang.Musahaf.type}\`${
						tl == 'AR' ? surah.type_ar : surah.type_en
					}\` •${lang.Musahaf.numberverses} \`${surah.verses}\`\n\n${lang.Musahaf.quailtybad}**`;
					if (surah.verses === true) transliteration = `**${tl == 'AR' ? surah.name : surah.transliteration_en}**`;
					embed(interaction, transliteration, 'p-', {
						title: `${lang.Musahaf.NumberPage} ${surah.page}`,
						interaction: {
							stats: true
						},
						file: {
							attachment: `attachment://${page}.jpg`
						},
						components: [
							{
								type: 1,
								components: [
									{
										type: 2,
										emoji: client.emoji.audio_id.backward,
										style: 4,
										custom_id: 'quran&-&backward&-&' + interaction.user.id + '&-&' + page
									},
									{
										type: 2,
										emoji: client.emoji.data,
										style: 1,
										custom_id: 'quran&-&backup&-&' + interaction.user.id + '&-&' + page
									},
									{
										type: 2,
										emoji: client.emoji.audio_id.forward,
										style: 3,
										custom_id: 'quran&-&forward&-&' + interaction.user.id + '&-&' + page
									}
								]
							}
						],
						files: [Quran[page].musahaf]
					});
					break;
				case 'backup':
					await musahafSchema.findOneAndUpdate(
						{
							userID: interaction.user.id
						},
						{
							$set: {
								page: page
							}
						},
						{
							upsert: true
						}
					);
					break;
				case 'forward':
					{
						page++ - 1;
						if (!Quran[page]) page = 1;
						let tl = FindGuild?.language || 'AR';
						const lang = require(`../../language_extc/${tl}.js`);
						let surah = Quran[page];
						let transliteration = `**•\`${tl == 'AR' ? surah.name : 'Surah ' + surah.transliteration_en}\`\n \n•${lang.Musahaf.type}\`${
							tl == 'AR' ? surah.type_ar : surah.type_en
						}\` •${lang.Musahaf.numberverses} \`${surah.verses}\`\n\n${lang.Musahaf.quailtybad}**`;
						if (surah.verses === true) transliteration = `**${tl == 'AR' ? surah.name : surah.transliteration_en}**`;
						embed(interaction, transliteration, 'p-', {
							title: `${lang.Musahaf.NumberPage} ${surah.page}`,
							interaction: {
								stats: true
							},
							file: {
								attachment: `attachment://${page}.jpg`
							},
							components: [
								{
									type: 1,
									components: [
										{
											type: 2,
											emoji: client.emoji.audio_id.backward,
											style: 4,
											custom_id: 'quran&-&backward&-&' + interaction.user.id + '&-&' + page
										},
										{
											type: 2,
											emoji: client.emoji.data,
											style: 1,
											custom_id: 'quran&-&backup&-&' + interaction.user.id + '&-&' + page
										},
										{
											type: 2,
											emoji: client.emoji.audio_id.forward,
											style: 3,
											custom_id: 'quran&-&forward&-&' + interaction.user.id + '&-&' + page
										}
									]
								}
							],
							files: [Quran[page].musahaf]
						});
					}
					break;
			}
		}
	}
}

exports.interactionCreate = interactionCreate;
