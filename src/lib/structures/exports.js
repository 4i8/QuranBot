const { MessageEmbed } = require('discord.js');
const { colors: ers, emojis: emoji, Links } = require('../../config.json');
const surahnumber = require('../../data/surah/number.json');
const surahname = require('../../data/surah/name.json');
const fixArabicNumbers = require('fix-arabic-numbers');
const guildSchema = require('../../schema/guild');
module.exports = {
	surahprocess: function (args) {
		return new Promise((resolve, reject) => {
			if (['surah', 'surat', 'سورة', 'سوره'].includes(args[0].toLowerCase()) && args[1] && surahname['سورة ' + args[1]] !== undefined) {
				//name surah
				resolve(surahname['سورة ' + args[1]]);
			} else if (
				['surah', 'surat', 'سورة', 'سوره'].includes(args[0].toLowerCase()) &&
				fixArabicNumbers(args[1]) <= 114 &&
				surahnumber[fixArabicNumbers(args[1])] !== undefined
			) {
				//id surah
				resolve(surahnumber[fixArabicNumbers(args[1])]);
			} else if (
				surahnumber[fixArabicNumbers(args[0])] !== undefined &&
				fixArabicNumbers(args[0]) <= 114 &&
				fixArabicNumbers(args[0]) &&
				fixArabicNumbers(args[0]) !== fixArabicNumbers('0')
			) {
				//number only
				resolve(surahnumber[fixArabicNumbers(args[0])]);
			} else if (surahname['سورة ' + fixArabicNumbers(args[0])] !== undefined && args[0]) {
				//name only
				resolve(surahname['سورة ' + fixArabicNumbers(args[0])]);
			} else if (args[0] + ' ' + args[1] && args[0] == 'آل' && args[0] !== 'سورة' && args[1] == 'عمران') {
				resolve(surahname['سورة ' + args[0] + ' ' + args[1]]);
			} else if (
				args[0] + ' ' + args[1] + ' ' + args[2] &&
				args[1] == 'آل' &&
				['surah', 'surat', 'سورة', 'سوره'].includes(args[0].toLowerCase()) &&
				args[2] == 'عمران'
			) {
				resolve(surahname['سورة' + ' ' + args[1] + ' ' + args[2]]);
			} else if (['كامل', 'all', 'كاملاً', 'كاملا'].includes(args[0].toLowerCase())) {
				resolve(surahname['كامل']);
			} else {
				reject('لم يتم العثور على سورة بنجاح');
			}
		});
	},
	code: function (length) {
		var result = '';
		var characters =
			'ieugi398y9398uibguioisoopifopigAieugi398y9398uibguioisoopifopigBCieugi398y9398uibguioisoopifopigDEFGHIJKLMNABCDEFGHIJKLMNOihrh8oieugi398y9398uibguioisoopifopigQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789Oihrh8oieugi398y9398uibguioisoopifopigQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
	iscolor: function (hex) {
		return typeof hex === 'string' && hex.length === 6 && !isNaN(Number('0x' + hex));
	},
	isEmoji: function (str) {
		const rsDingbat = '[\\u2700-\\u27bf]';
		const rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
		const rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';

		const keycap = '[\\u0023-\\u0039]\\ufe0f?\\u20e3';
		const miscSymbols = '[\\u2600-\\u26FF]';
		const cjkLettersAndMonths = ['\\u3299', '\\u3297'];
		const cjkSymbolsAndPunctuation = ['\\u303d', '\\u3030'];
		const enclosedAlphanumerics = ['\\u24c2'];
		const enclosedAlphanumericSupplement = [
			'\\ud83c[\\udd70-\\udd71]',
			'\\ud83c[\\udd7e-\\udd7f]',
			'\\ud83c\\udd8e',

			'\\ud83c[\\udd91-\\udd9a]',

			'\\ud83c[\\udde6-\\uddff]'
		];
		const enclosedIdeographicSupplement = [
			'[\\ud83c[\\ude01-\\ude02]',
			'\\ud83c\\ude1a',
			'\\ud83c\\ude2f',
			'[\\ud83c[\\ude32-\\ude3a]',
			'[\\ud83c[\\ude50-\\ude51]'
		];
		const generalPunctuation = ['\\u203c', '\\u2049'];
		const geometricShapes = ['[\\u25aa-\\u25ab]', '\\u25b6', '\\u25c0', '[\\u25fb-\\u25fe]'];
		const latin1Supplement = ['\\u00a9', '\\u00ae'];
		const letterLikeSymbols = ['\\u2122', '\\u2139'];
		const mahjongTiles = ['\\ud83c\\udc04'];
		const miscSymbolsAndArrows = ['\\u2b05', '\\u2b06', '\\u2b07', '\\u2b1b', '\\u2b1c', '\\u2b50', '\\u2b55'];
		const miscTechnical = ['\\u231a', '\\u231b', '\\u2328', '\\u23cf', '[\\u23e9-\\u23f3]', '[\\u23f8-\\u23fa]'];
		const playingCards = ['\\ud83c\\udccf'];
		const supplementalArrows = ['\\u2934', '\\u2935'];
		const arrows = ['[\\u2190-\\u21ff]'];
		const supplemental = []
			.concat(
				rsDingbat,
				rsRegional,
				rsSurrPair,

				keycap,
				cjkLettersAndMonths,
				cjkSymbolsAndPunctuation,
				enclosedAlphanumerics,
				enclosedAlphanumericSupplement,
				enclosedIdeographicSupplement,
				generalPunctuation,
				geometricShapes,
				latin1Supplement,
				letterLikeSymbols,
				mahjongTiles,
				miscSymbols,
				miscSymbolsAndArrows,
				miscTechnical,

				playingCards,
				supplementalArrows,
				arrows
			)
			.join('|');

		const rsEmoji = '(?:' + supplemental + ')';

		const emojiRegex = new RegExp(rsEmoji);
		return emojiRegex.test(str);
	},
	/**
     * 
     * @example 
                (message,
                `Description`,
                "color").then(async(msg)=>{
  
                })
              
     */
	embed: async function (
		message,
		Description = '',
		color = '',
		options = {
			client: false,
			interaction: {
				stats: false,
				ephemeral: false
			},
			author: false,
			Thumbnail: false,
			edit: false,
			components: [],
			title: false,
			file: {
				Thumbnail: false,
				attachment: false,
				name: ''
			},
			files: [],
			isplay: false
		}
	) {
		return new Promise(async (resolve, reject) => {
			function resolveKey(interaction, key, options = { replace: {} }) {
				return new Promise(async (resolve, reject) => {
					if (!interaction) return reject('interaction is not defined');
					if (!key) return reject('key is not defined');
					const kit = key.split(':');
					//Database
					if (interaction.guild?.id || interaction?.guild) {
						var guildSettings = await guildSchema.findOne({ guildID: !interaction.guild?.id ? interaction.guild : interaction.guild.id });
					} else {
						guildSettings = { language: 'AR' };
					}
					const language = require(`../../languages/${guildSettings.language}/${kit[0]}.json`);
					let value = language[kit[1]];
					if (!value) return 'No Value';
					if (options?.replace) {
						Object.keys(options.replace).forEach((key) => {
							value = value.replace(`{{${key}}}`, options.replace[key]);
						});
					}
					return resolve(value);
				});
			}
			if (options.interaction && options.interaction.stats) {
				message.author = message.user;
			} else if (options.client) {
				message.author = options.client.user;
			}
			let colorfun = {
				P: ers.Primary,
				W: ers.Warn,
				E: ers.Error,
				D: ers.Primary
			};
			let auto = new MessageEmbed().setAuthor({
				name: `${message.author.tag}`,
				iconURL: message.author.displayAvatarURL({
					dynamic: true,
					format: 'png',
					size: 4096
				})
			}).setFooter("/recovery "+await resolveKey(message, 'structure:recovery'))
			if (color.toUpperCase() == 'P' || color.toUpperCase().split('!')[1] == 'P') {
				auto.setDescription(
					`**${Description} - ${emoji.True}${options.isplay ? `\n${await resolveKey(message, 'commands:alert_voice')}` : ''}**`
				);
			} else if (color.toUpperCase() == 'W' || color.toUpperCase().split('!')[1] == 'W') {
				auto.setDescription(
					`**${Description} - ${emoji.warn}${options.isplay ? `\n${await resolveKey(message, 'commands:alert_voice')}` : ''}**`
				);
			} else if (color.toUpperCase() == 'E' || color.toUpperCase().split('!')[1] == 'E') {
				if (!options.components) options.components = [];
				options.components.push({
					type: 1,
					components: [
						{
							type: 2,
							style: 5,
							label: 'الدعم الفني/Support',
							url: Links.server
						}
					]
				});
				auto.setDescription(
					`**${Description} - ${emoji.error}${options.isplay ? `\n${await resolveKey(message, 'commands:alert_voice')}` : ''}**`
				);
			} else if (color.toUpperCase() == 'D' || color.toUpperCase().split('!')[1] == 'D') {
				auto.setDescription(
					`**${Description} - ${emoji.relieved + emoji.True}${
						options.isplay ? `\n${await resolveKey(message, 'commands:alert_voice')}` : ''
					}**`
				);
			} else {
				auto.setDescription(`**${Description}${options.isplay ? `\n${await resolveKey(message, 'commands:alert_voice')}` : ''}**`);
			}
			if (options.title && typeof options.title == 'string') {
				auto.setTitle(options.title);
			}
			auto.setColor(
				!(
					typeof color.toLowerCase().split('!')[0] === 'string' &&
					color.toLowerCase().split('!')[0].length === 6 &&
					!isNaN(Number('0x' + color.toLowerCase().split('!')[0]))
				)
					? colorfun[color.replace('-', '').toUpperCase()]
					: `#${color.toLowerCase().split('!')[0]}`
			);
			try {
				if (options.file.Thumbnail) auto.setThumbnail(options.file.attachment);
				else if (options.file.attachment) {
					auto.setImage(options.file.attachment);
				}
			} catch (error) {}
			if (typeof options.Thumbnail == 'boolean' && options.Thumbnail)
				auto.setThumbnail(
					message.author.displayAvatarURL({
						dynamic: true,
						format: 'png',
						size: 4096
					})
				);
			function basis(params) {
				params.then((i) => {
					resolve(i);
				});
			}
			if (options.author) {
				basis(
					message.author.send({
						embeds: [auto],
						files: options.files,
						component: options.components
					})
				);
			} else if (options.edit) {
				basis(
					options.edit.edit({
						embeds: [auto]
					})
				);
			} else {
				if (options.interaction && options.interaction.stats) {
					message.editReply({
						components: options.components,
						embeds: [auto],
						ephemeral: options.interaction.ephemeral,
						files: options.files
					});
				} else {
					message
						.reply({
							components: options.components,
							embeds: [auto],
							ephemeral: true,
							files: options.files
						})
						.then((i) => {
							return resolve(i);
						})
						.catch((err) => {
							if (err.code == 50035) {
								message.channel
									.send({
										components: options.components,
										embeds: [auto]
									})
									.then((i) => {
										return resolve(i);
									});
							}
						});
				}
			}
		});
	},
	Process: function (properties) {
		const db = require('../unit/Process');
		let Properties = db[properties];
		let Processing_properties = [];
		for (let index = 0; index < Properties.length; index++) {
			if (index == 0) {
				Processing_properties += `> \`${index + 1}\`-${Properties[index]}\n`;
			} else if (index !== 0) {
				Processing_properties += `> \`${index + 1}\`-${Properties[index]}\n`;
			}
		}
		return Processing_properties;
	},
	permissions: function (message, client = [], member = []) {
		return new Promise((resolve, reject) => {
			qmy.get(table, `id:${process.client_id}`).then(async (result) => {
				var Role = await message.guild.roles.cache.find((r) => r.id === result.management);
				if (require('../config.json').settings.Owner_ID.includes(message.author.id)) {
					return resolve(false);
				}
				if (result.management) {
					if (Role) {
						if (message.member.roles.cache.some((r) => r.id === result.management)) return resolve(false);
					} else if (result.management === 'everyone') {
						return resolve(false);
					}
				}
				const neededclient = [];
				client.forEach((perm) => {
					if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
						neededclient.push(perm);
					}
				});
				const needed = [];
				member.forEach((perm) => {
					if (!message.channel.permissionsFor(message.member).has(perm)) {
						needed.push(perm);
					}
				});
				if (neededclient.length > 0) {
					return resolve(Permission.main.client.AR + neededclient.map((p) => `\`${p.toUpperCase()}\``).join(', '));
				} else if (needed.length > 0) {
					return resolve(Permission.main.User.AR + needed.map((p) => `\`${p.toUpperCase()}\``).join(', '));
				} else {
					return resolve(false);
				}
			});
		});
	},
	SetInterval: function () {
		return {
			key: process.cache.interval,
			start: (callback, time, key) => {
				if (process.cache.interval[key]) return;
				process.cache.interval[key] = setInterval(callback, time);
			},
			clear: (key) => {
				if (process.cache.interval[key]) {
					clearInterval(process.cache.interval[key]);
					delete process.cache.interval[key];
				}
			}
		};
	},
	resolveKey: function (interaction, key, options = { replace: {} }) {
		return new Promise(async (resolve, reject) => {
			if (!interaction) return reject('interaction is not defined');
			if (!key) return reject('key is not defined');
			const kit = key.split(':');
			//Database
			if (interaction.guild?.id || interaction?.guild) {
				var guildSettings = await guildSchema.findOne({ guildID: !interaction.guild?.id ? interaction.guild : interaction.guild.id });
			} else {
				guildSettings = { language: 'AR' };
			}
			const language = require(`../../languages/${guildSettings.language}/${kit[0]}.json`);
			let value = language[kit[1]];
			if (!value) return 'No Value';
			if (options?.replace) {
				Object.keys(options.replace).forEach((key) => {
					value = value.replace(`{{${key}}}`, options.replace[key]);
				});
			}
			return resolve(value);
		});
	}
};
