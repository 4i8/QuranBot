const { Command } = require('@sapphire/framework');
const readers = require('../../data/audio/reader.json');
const surahs = require('../../data/surah/array.json');
const surahsNAME = require('../../data/surah/name.json');
const { embed, resolveKey } = require('../../lib/structures/exports');
const { convertTime } = require('../../lib/utils/convert');
const delay = require('delay');
const tacs = require('tacs');
const humanizeDuration = require('humanize-duration');
const ms = require('ms');
const extra = require('../../lib/utils/extra');
const guildSchema = require('../../schema/guild');
const stringSimilarity = require('string-similarity');

class PlayCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'play',
			description: 'تشغيل قرآن الكريم/play quran',
			preconditions: ['GuildOnly', 'HasPerm', 'InVoice', 'SameVoice', 'HasRecovery']
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
					type: 'STRING',
					name: 'القارئ-reader',
					description: "اسم القارئ أو رقمه/reader's name or id",
					autocomplete: true,
					required: true
				},
				{
					type: 'STRING',
					name: 'السورة-surah',
					description: "اسم السورة أو الرقم/surah's name or number",
					autocomplete: true,
					required: true
				}
			]
		});
	}

	/**
	 *
	 * @param {Command.AutocompleteInteraction} interaction
	 */
	async autocompleteRun(interaction) {
		let language = (await guildSchema.findOne({ guildID: interaction.guild.id }).then((res) => res.language)) || 'AR';
		const focused = interaction.options.getFocused(true);
		if (focused.name == 'السورة-surah') {
			const matches = stringSimilarity.findBestMatch(
				focused.value,
				surahs.map((surah) => surah.name) ||
					stringSimilarity.findBestMatch(
						focused.value,
						surahs.map((surah) => surah.transliteration_en)
					) ||
					stringSimilarity.findBestMatch(
						focused.value,
						surahs.map((surah) => surah.id.toString())
					)
			);
			const filtered = [
				{
					id: 0,
					name: 'القرآن كاملاً',
					transliteration_en: 'The whole Quran'
				}
			];
			filtered.push(
				...surahs
					.filter((surah, index) =>
						matches.ratings > 0
							? (surah.id == parseInt(focused.value) ||
									surah.name.includes(focused.value) ||
									surah.transliteration_en.includes(focused.value)) &&
							  index !== matches.bestMatchIndex
							: surah.id == parseInt(focused.value) ||
							  surah.name.includes(focused.value) ||
							  surah.transliteration_en.includes(focused.value)
					)
					.concat(matches.ratings > 0 ? surahs[matches.bestMatchIndex] : [])
					.slice(0, 24)
			);
			await interaction.respond(
				filtered.map((s) => ({
					name: `${s.id == `0` ? '' : `${s.id}-`}${language !== 'AR' ? s.transliteration_en : s.name}`,
					value: s.id.toString()
				}))
			);
		} else if (focused.name == 'القارئ-reader') {
			const filtered = readers
				.filter((reader) => reader.id === focused.value || reader.name.includes(focused.value) || reader.name_en.includes(focused.value))
				.slice(0, 25);
			await interaction.respond(
				filtered.map((r) => ({
					name: `${r.id}-${language !== 'AR' ? r.name_en : r.name} ${r?.rewaya ? `(${r.rewaya})` : ''}`,
					value: r.id.toString()
				}))
			);
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
		// Get the reader and surah
		let surahID = interaction.options.getString('السورة-surah');
		let readerID = interaction.options.getString('القارئ-reader');
		// Check if the reader exists or surah exists
		let reader = readers.filter((r) => r.id == parseInt(readerID))[0];
		let surah = surahs.filter((s) => s.id == parseInt(surahID));
		surah = parseInt(surahID) == 0 ? surahsNAME['كامل'] : surah[0];
		if (!surah || !reader) {
			embed(
				interaction,
				await resolveKey(interaction, 'commands:wrong_options', {
					replace: {
						emoji: client.emoji.error
					}
				}),
				'e',
				{
					interaction: {
						stats: true
					}
				}
			);
			return;
		}
		//basis for this command
		if (process.cache.await[interaction.guildId]?.date && Date.now() > process.cache.await[interaction.guildId]?.date + ms('2m')) {
			delete process.cache.await[interaction.guildId];
		}
		if (process.cache.await[interaction.guildId]) {
			embed(
				interaction,
				await resolveKey(interaction, 'commands:play_still_working', {
					replace: {
						time: `\`${humanizeDuration(process.cache.await[interaction.guildId].date - Date.now(), {
							language: 'ar'
						})}\``
					}
				}),
				'e',
				{
					interaction: {
						stats: true
					}
				}
			);
			return;
		}
		setTimeout(() => {
			delete process.cache.await[interaction.guildId];
		}, ms('2m'));
		process.cache.await[interaction.guildId] = { date: Date.now() + ms('2m') };
		const conv = new tacs();
		const FindGuild = await guildSchema.findOne({
			guildID: interaction.guildId
		});
		const voiceChannel =
			(await interaction.client.channels.cache
				.get(interaction.member.voice.channelId)
				.members.filter((m) => m.user.id === interaction.client.user.id).size) > 0
				? true
				: null;
		if (!voiceChannel) {
			let playerOP = client.manager.get(interaction.guildId);
			if (playerOP) {
				playerOP?.destroy();
			}
		}
		async function play(isloop = FindGuild?.loop || false) {
			let PlayerManager = client.manager.get(interaction.guildId);
			if (PlayerManager?.queue.size + (parseInt(surahID) == 0 ? 114 : 1) > 114) {
				//limit play quran
				embed(interaction, await resolveKey(interaction, 'commands:play_limit'), 'e', {
					interaction: {
						stats: true
					}
				});
				return;
			}
			const player = client.manager.create({
				guild: interaction.guildId,
				textChannel: interaction.member.voice.channelId,
				voiceChannel: interaction.member.voice.channelId,
				selfDeafen: true,
				volume: FindGuild?.volume || 100
			});
			if (player.state != 'CONNECTED') await player.connect();
			player.setQueueRepeat(isloop);
			player.interaction = interaction;
			player.textChannel = interaction.member.voice.channelId;
			//comment quran all surah
			let all = {};
			let res;
			let check = [];
			if (parseInt(surahID) == 0) {
				check.push('all');
				process.cache.await[interaction.guildId] = {
					date: Date.now() + ms('114s')
				};
				conv.$lab(async (element, index) => {
					if (!process.cache.await[interaction.guildId]) {
						return conv.kill();
					}
					res = await player.search(`${reader.server}/${element}`, interaction.user);
					if (res.loadType == 'NO_MATCHES' || res.loadType == 'LOAD_FAILED') {
						check.includes('error_all');
						conv.kill();
						player.pause(true);
						setTimeout(() => {
							player.destroy();
						}, 2000);
						return embed(
							interaction,
							(await resolveKey(interaction, 'commands:play_download_error')) +
								`\`\`\`\n{"surah":"${surah.name}",\n"reader":"${reader.name}",\n"rewaya":"${reader.rewaya}"\n}\n\`\`\``,
							'e',
							{
								interaction: {
									stats: true
								}
							}
						);
					} else {
						extra(res, {
							voice: interaction.member.voice.channelId,
							text: interaction.member.voice.channelId,
							title: `${await resolveKey(interaction, 'extra:suratarrangement')}\`${surahs[index].id}\` - ${
								'AR' == 'AR'
									? surahs[index].name
									: surahs[index].transliteration == 'All Quran'
									? 'All Quran'
									: 'Surat ' + surahs[index].transliteration
							}\`[${convertTime(res.tracks[0].duration)}]\` ${await resolveKey(interaction, 'extra:quran_reders')} ${reader.name}${
								reader?.rewaya ? `(${reader.rewaya})` : ''
							}`,
							recovery: false
						});
						all[index] = res;
						conv.next()
							.then(() => {
								player.queue.add(res.tracks[0]);
								if (!player.playing && !player.paused && !player.queue.size) {
									check.push(true);
									return player.play();
								}
							})
							.catch(() => {});
					}
				});
				surah.audio.forEach(async (element) => {
					conv.add(element).catch(() => {});
				});
				conv.on('end', async () => {
					delete process.cache.await[interaction.guildId];
				});
			} else {
				delete process.cache.await[interaction.guildId];
				res = await player.search(`${reader.server}/${surah.audio}`, interaction.user);
				if (res.loadType == 'NO_MATCHES' || res.loadType == 'LOAD_FAILED') {
					check.includes('error_all');
					conv.kill();
					player.pause(true);
					setTimeout(() => {
						player.destroy();
					}, 2000);
					return embed(
						interaction,
						(await resolveKey(interaction, 'commands:play_download_error')) +
							`\`\`\`\n{"surah":"${surah.name}",\n"reader":"${reader.name}",\n"rewaya":"${reader.rewaya}"\n}\n\`\`\``,
						'e',
						{
							interaction: {
								stats: true
							}
						}
					);
				} else {
					extra(res, {
						voice: interaction.member.voice.channelId,
						text: interaction.member.voice.channelId,
						title: `${await resolveKey(interaction, 'extra:suratarrangement')}\`${surah.id}\` - ${
							'AR' == 'AR' ? surah.name : surah.transliteration == 'All Quran' ? 'All Quran' : 'Surat ' + surah.transliteration
						}\`[${convertTime(res.tracks[0]?.duration)}]\` ${await resolveKey(interaction, 'extra:quran_reders')} ${reader.name}${
							reader?.rewaya ? `(${reader.rewaya})` : ''
						}`,
						recovery: false
					});
				}
			}
			if (check.includes('error_all')) return;
			if (!player) {
				return embed(interaction, await resolveKey(interaction, 'commands:play_no_queue'), 'e', {
					interaction: {
						stats: true
					}
				});
			}
			await delay(check.includes('all') ? 2000 : 10);
			switch (res.loadType) {
				case 'LOAD_FAILED':
					if (check.includes('error_all')) return;
					conv.kill();
					if (!player.queue.current) player.destroy();
					return embed(
						interaction,
						(await resolveKey(interaction, 'commands:play_download_error')) +
							`\`\`\`\n{"surah":"${surah.name}",\n"reader":"${reader.name}",\n"rewaya":"${reader.rewaya}"\n}\n\`\`\``,
						'e',
						{
							interaction: {
								stats: true
							}
						}
					);
				case 'NO_MATCHES':
					if (!player.queue.current) player.destroy();
					return embed(interaction, await resolveKey(interaction, 'commands:play_search_err'), 'e', {
						interaction: {
							stats: true
						}
					});
				case 'TRACK_LOADED':
					if (check.includes('all')) {
						if (player.queue.size > 1 || check.includes(true)) {
							return embed(
								interaction,
								await resolveKey(interaction, 'commands:play_alot_tracks', {
									replace: {
										size: check.includes(true) ? '113' : '114'
									}
								}),
								'p',
								{
									interaction: {
										stats: true
									},
									isplay: interaction.member.voice.channelId !== interaction.channelId ? true : false,
									components: []
								}
							);
						}
					} else {
						var track = res.tracks[0];
						player.queue.add(track);
						if (!player.playing && !player.paused && !player.queue.size) {
							if (interaction.member.voice.channelId === interaction.channelId) {
								interaction.deleteReply().catch(() => {});
							}
							if (interaction.member.voice.channelId !== interaction.channelId) {
								embed(interaction, await resolveKey(interaction, 'commands:alert_voice'), 'p', {
									interaction: {
										stats: true
									},
									components: []
								});
							}
							return player.play();
						} else {
							return embed(
								interaction,
								await resolveKey(interaction, 'commands:play_one_track', {
									replace: {
										title: track.title
									}
								}),
								'p',
								{
									interaction: {
										stats: true
									},
									isplay: interaction.member.voice.channelId !== interaction.channelId ? true : false,
									components: []
								}
							);
						}
					}
			}
		}
		const KEY = interaction.user.id + String(Date.now());
		if (!FindGuild.remember.loop && !FindGuild.loop) {
			let components = [
				{
					type: 1,
					components: [
						{
							type: 2,
							emoji: client.emoji.settings_id.error,
							style: 4,
							custom_id: 'no' + KEY
						},
						{
							type: 2,
							emoji: client.emoji.settings_id.True,
							style: 3,
							custom_id: 'yes' + KEY
						}
					]
				}
			];
			embed(interaction, await resolveKey(interaction, 'commands:loop_remember'), 'p-', {
				interaction: {
					stats: true
				},
				components: components
			});
			const collector = interaction.channel.createMessageComponentCollector({
				filter: async (b) => {
					if (b.user.id !== interaction.user.id) {
						await b.deferReply({
							ephemeral: true
						});
						embed(b, await resolveKey(interaction, 'commands:queue_no_permission'), 'e', {
							interaction: {
								stats: true,
								ephemeral: true
							}
						});
						return false;
					} else {
						return true;
					}
				},
				time: ms('30s')
			});
			let CacheTimeOut = setTimeout(() => {
				play();
			}, ms('30s'));
			collector.on('collect', async (button) => {
				await button.deferUpdate().catch(() => {});
				clearTimeout(CacheTimeOut);
				if (button.customId === 'yes' + KEY) {
					FindGuild.loop = true;
					FindGuild.remember.loop = true;
					await FindGuild.save();
					play(true);
					collector.stop();
				} else if (button.customId === 'no' + KEY) {
					FindGuild.remember.loop = true;
					await FindGuild.save();
					play();
					collector.stop();
				}
			});
		} else {
			play();
		}
	}
}

exports.PlayCommand = PlayCommand;
