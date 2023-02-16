const { WebhookClient, MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const { hook } = require('./hook');
const guildSchema = require('../../schema/guild');
const { SetInterval } = require('../structures/exports');
const ms = require('ms');
exports.StartAzkar = async (data) => {
	SetInterval().start(
		async () => {
			if (SetInterval().key[data.webhookToken]) {
				SetInterval().clear(data.webhookToken);
			}
			const FindGuild = await guildSchema.findOne({ guildID: data.guildID });
			const FindAzkar = FindGuild.azkar.find((x) => x.webhookToken === data.webhookToken);
			if (!FindAzkar || FindAzkar.channelID === null) return SetInterval().clear(data.webhookToken);
			let zekr = require('../../data/azkar')[Math.floor(Math.random() * Math.floor(require('../../data/azkar').length))];
			new WebhookClient({
				id: data.webhookID,
				token: data.webhookToken
			})
				.send({
					embeds: [
						new MessageEmbed()
							.setTitle(zekr.category)
							.setDescription(`**${zekr.zekr}${zekr?.reference ? `\n\n${zekr.reference}` : ''}**`)
							.setColor(FindAzkar?.color ? FindAzkar?.color : config.colors.Primary)
							.setTimestamp()
					]
				})
				.then(() => {
					this.StartAzkar(data);
				})
				.catch(async (error) => {
					if (error.code === 10015 || error.code === 50027) {
						if (SetInterval().key[data.webhookToken]) {
							SetInterval().clear(data.webhookToken);
						}
						await guildSchema.findOneAndUpdate(
							{
								guildID: data.guildID,
								'azkar.channelID': data.channelID
							},
							{
								$set: {
									'azkar.$.channelID': null
								}
							}
						);
					} else {
						this.StartAzkar(data);
					}
					hook(
						error.toString() +
							`\n{
						guildID: ${data.guildID},
						'azkar.channelID': ${data.channelID}
					}`
					).error();
				});
		},
		ms(ms(data.time)),
		data.webhookToken
	);
	return;
};
exports.StartKhutma = async (data) => {
	SetInterval().start(
		async () => {
			if (SetInterval().key[data.webhookToken]) {
				SetInterval().clear(data.webhookToken);
			}
			const FindGuild = await guildSchema.findOne({ guildID: data.guildID });
			const FindKhutma = FindGuild.khutma.find((x) => x.webhookToken === data.webhookToken);
			if (!FindKhutma || FindKhutma.channelID === null) return SetInterval().clear(data.webhookToken);
			let page = FindKhutma.page + 1;
			await guildSchema.findOneAndUpdate(
				{
					guildID: data.guildID,
					'khutma.channelID': data.channelID
				},
				{
					$set: {
						'khutma.$.page': page
					}
				}
			);
			if (page > 604) {
				await guildSchema.findOneAndUpdate(
					{
						guildID: data.guildID,
						'khutma.channelID': data.channelID
					},
					{
						$set: {
							'khutma.$.channelID': null
						}
					}
				);
				if (SetInterval().key[data.webhookToken]) {
					SetInterval().clear(data.webhookToken);
				}
				return;
			}
			const khutma = require('../../data/surah/quran');
			let tl = FindGuild?.language || 'AR';
			const lang = require(`../../language_extc/${tl}.js`);
			let surah = khutma[`${page}`];
			let transliteration = `**•\`${tl == 'AR' ? surah.name : 'Surah ' + surah.transliteration_en}\`\n \n•${lang.Musahaf.type}\`${
				tl == 'AR' ? surah.type_ar : surah.type_en
			}\` •${lang.Musahaf.numberverses} \`${surah.verses}\`\n\n${lang.Musahaf.quailtybad}**`;
			if (surah.verses === true) transliteration = `**${tl == 'AR' ? surah.name : surah.transliteration_en}**`;
			await new WebhookClient({
				id: data.webhookID,
				token: data.webhookToken
			})
				.send({
					embeds: [
						new MessageEmbed()
							.setTitle(`${lang.Musahaf.NumberPage} ${surah.page}`)
							.setDescription(`**${transliteration}**`)
							.setColor(FindKhutma?.color ? FindKhutma?.color : config.colors.Primary)
							.setTimestamp()
							.setImage(`attachment://${surah.page}.jpg`)
					],
					files: [surah.musahaf],
					components: [
						{
							type: 1,
							components: [
								{
									type: 2,
									emoji: config.emojis.data,
									style: 1,
									custom_id: 'pin&-&backup&-&null&-&' + surah.page
								}
							]
						}
					]
				})
				.then(() => {
					this.StartKhutma(data);
				})
				.catch(async (error) => {
					if (error.code === 10015 || error.code === 50027) {
						await guildSchema.findOneAndUpdate(
							{
								guildID: data.guildID,
								'khutma.channelID': data.channelID
							},
							{
								$set: {
									'khutma.$.channelID': null
								}
							}
						);

						if (SetInterval().key[data.webhookToken]) {
							SetInterval().clear(data.webhookToken);
						}
					} else {
						await guildSchema.findOneAndUpdate(
							{
								guildID: data.guildID,
								'khutma.channelID': data.channelID
							},
							{
								$set: {
									'khutma.$.page': Math.abs(page - 1)
								}
							}
						);
						this.StartKhutma(data);
					}
					hook(
						error.toString() +
							`\n{
						guildID: ${data.guildID},
						'khutma.channelID': ${data.channelID}
					}`
					).error();
				});
			if (page === 604) {
				new WebhookClient({
					id: data.webhookID,
					token: data.webhookToken
				})
					.send({
						files: [require('path').resolve(__dirname, `../../language_extc/image/khatam_${tl}.jpg`)]
					})
					.then(async () => {
						await guildSchema.findOneAndUpdate(
							{
								guildID: data.guildID,
								'khutma.channelID': data.channelID
							},
							{
								$set: {
									'khutma.$.channelID': null
								}
							}
						);
						if (SetInterval().key[data.webhookToken]) {
							SetInterval().clear(data.webhookToken);
						}
					})
					.catch(async (error) => {
						if (error.code === 10015 || error.code === 50027) {
							await guildSchema.findOneAndUpdate(
								{
									guildID: data.guildID,
									'khutma.channelID': data.channelID
								},
								{
									$set: {
										'khutma.$.channelID': null
									}
								}
							);
							if (SetInterval().key[data.webhookToken]) {
								SetInterval().clear(data.webhookToken);
							}
						} else {
							await guildSchema.findOneAndUpdate(
								{
									guildID: data.guildID,
									'khutma.channelID': data.channelID
								},
								{
									$set: {
										'khutma.$.page': Math.abs(page - 1)
									}
								}
							);
							this.StartKhutma(data);
						}
						hook(
							error.toString() +
								`\n{
							guildID: ${data.guildID},
							'khutma.channelID': ${data.channelID}
						}`
						).error();
					});
			}
		},
		ms(ms(data.time)),
		data.webhookToken
	);
	return;
};
