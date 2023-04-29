const { Command } = require('@sapphire/framework');
const alqsaas = require('../../data/audio/qasas.json');
const { embed, resolveKey } = require('../../lib/structures/exports');
const { convertTime } = require('../../lib/utils/convert');
const tacs = require('tacs');
const humanizeDuration = require('humanize-duration');
const ms = require('ms');
const extra = require('../../lib/utils/extra');
const guildSchema = require('../../schema/guild');
const stringSimilarity = require('string-similarity');
class QasasCommand extends Command {
	/**
	 *
	 * @param {Command.Context} context
	 * @param {Command.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			name: 'qasas',
			description: 'تشغيل قصص الانبياء /play qasas',
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
					name: 'القصة',
					description: 'اسم القصة المراد تشغيلها/Select the story you want to play',
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
		const focused = interaction.options.getFocused(true);
		if (focused.name == 'القصة') {
			const matches = stringSimilarity.findBestMatch(
				focused.value,
				alqsaas.map((x) => x.qsa)
			);
			const filtered = alqsaas
				.filter(
					(reader, index) =>
						(reader.id === parseInt(focused.value) || reader.name.includes(focused.value) || reader.qsa.includes(focused.value)) &&
						index !== matches.bestMatchIndex
				)
				.concat(alqsaas[matches.bestMatchIndex])
				.slice(0, 25);
			await interaction.respond(filtered.map((r) => ({ name: `${r.id}-${r?.qsa} (${r?.name})`, value: r.id.toString() })));
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
		// Get alqsaa
		let alqsaaID = interaction.options.getString('القصة');
		// Check if the reader exists or alqsaa exists
		let alqsaa = alqsaas.filter((s) => s.id == parseInt(alqsaaID))[0];
		if (!alqsaa) {
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
		process.cache.await[interaction.guildId] = { date: Date.now() + ms('114s') };
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
			if (PlayerManager?.queue.size + 1 > 114) {
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
			let res;
			let check = [];
			delete process.cache.await[interaction.guildId];
			res = await player.search(`${alqsaa.server}`, interaction.user);
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
						`\`\`\`\n{"alqsaa":"${alqsaa.name}",\n"qssa":"${alqsaa.qsa}"\n}\n\`\`\``,
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
					title: `${alqsaa.qsa}(${alqsaa.id})\`[${convertTime(res.tracks[0]?.duration)}]\`-${alqsaa.name}`,
					recovery: false
				});
			}
			if (check.includes('error_all')) return;
			if (!player) {
				return embed(interaction, await resolveKey(interaction, 'commands:play_no_queue'), 'e', {
					interaction: {
						stats: true
					}
				});
			}
			switch (res.loadType) {
				case 'LOAD_FAILED':
					if (check.includes('error_all')) return;
					conv.kill();
					if (!player.queue.current) player.destroy();
					return embed(
						interaction,
						(await resolveKey(interaction, 'commands:play_download_error')) +
							`\`\`\`\n{"alqsaa":"${alqsaa.name}",\n"qssa":"${alqsaa.qsa}"\n}\n\`\`\``,
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
									title: `${alqsaa.qsa}(${alqsaa.id})\`[${convertTime(res.tracks[0]?.duration)}]\`-${alqsaa.name}`
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

exports.QasasCommand = QasasCommand;
