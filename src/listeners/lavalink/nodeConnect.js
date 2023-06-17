const { Listener, container } = require('@sapphire/framework');
const extra = require('../../lib/utils/extra');
const { Permissions } = require('discord.js');
const guildSchema = require('../../schema/guild');
const recoverySchema = require('../../schema/recovery.js');
const readers = require('../../data/audio/reader.json');
const surahs = require('../../data/surah/array.json');
const surahsNAME = require('../../data/surah/name.json');
const { resolveKey } = require('../../lib/structures/exports');
const { convertTime } = require('../../lib/utils/convert');
const delay = require('delay');
const tacs = require('tacs');
const ms = require('ms');
class NodeConnectEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'nodeConnect'
		});
	}

	async run(node) {
		const { client } = this.container;
		// client.manager.destroy();
		this.container.logger.info(`Node "${node.options.identifier}" connected.`);
		recoverySchema.find({}).then(async (a) => {
			for (var i = 0; i < a.length; i++) {
				let b = a[i];
				if (!process.cache.recovery[b.guildID]) {
					process.cache.recovery[b.guildID] = {
						stats: true
					};
				}
				if (!client.guilds.cache.get(b.guildID)) continue;
				try {
					var FindGuild = await guildSchema.findOne({
						guildID: b.guildID
					});
					var User = await client.guilds.cache.get(b.guildID)?.members.fetch(b.requester);
					var voice = await client.guilds.cache.get(b.guildID)?.channels.cache.get(b.voiceID);
					if (!User) {
						User = await client.guilds.cache.get(b.guildID)?.me;
					}
				} catch (msg) {
					delete process.cache.recovery[b.guildID];
				}
				if (
					!User ||
					!voice ||
					!voice.permissionsFor(client.user.id).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK, Permissions.FLAGS.VIEW_CHANNEL])
				) {
					delete process.cache.recovery[b.guildID];
					continue;
				}
				setTimeout(() => {
					delete process.cache.recovery[b.guildID];
				}, ms('2m'));
				const conv = new tacs();
				const player = client.manager.create({
					guild: b.guildID,
					textChannel: b.voiceID,
					voiceChannel: b.voiceID,
					selfDeafen: true,
					volume: FindGuild?.volume || 100
				});
				if (player.state != 'CONNECTED') await player.connect();
				player.setQueueRepeat(FindGuild?.loop);
				//comment quran all surah
				let all = {};
				let res;
				let check = [];
				// Get the reader and surah
				let surahID = b.key.split('&')[0];
				let readerID = b.key.split('&')[1];
				// Check if the reader exists or surah exists
				let reader = readers.filter((r) => r.id == parseInt(readerID))[0];
				let surah = surahs.filter((s) => s.id == parseInt(surahID));
				surah = parseInt(surahID) == 0 ? surahsNAME['كامل'] : surah[0];
				const interaction = {
					guild: {
						id: b.guildID
					},
					guildId: b.guildID,
					user: User
				};
				if (parseInt(surahID) == 0) {
					check.push('all');
					conv.$lab(async (element, index) => {
						res = await player.search(`${reader.server}/${element}`, interaction.user);
						if (res.loadType == 'NO_MATCHES' || res.loadType == 'LOAD_FAILED') {
							check.includes('error_all');
							conv.kill();
							player.pause(true);
							setTimeout(() => {
								player.destroy();
							}, 2000);
							return delete process.cache.recovery[b.guildID];
						} else {
							extra(res, {
								voice: b.voiceID,
								text: b.voiceID,
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
						return delete process.cache.recovery[b.guildID];
					} else {
						extra(res, {
							voice: b.voiceID,
							text: b.voiceID,
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
					return delete process.cache.recovery[b.guildID];
				}
				await delay(check.includes('all') ? 2000 : 10);
				switch (res?.loadType) {
					case 'LOAD_FAILED':
						if (check.includes('error_all')) return;
						conv.kill();
						if (!player.queue.current) player.destroy();
						return delete process.cache.recovery[b.guildID];
					case 'NO_MATCHES':
						if (!player.queue.current) player.destroy();
						return delete process.cache.recovery[b.guildID];
					case 'TRACK_LOADED':
						if (check.includes('all')) {
							if (player.queue.size > 1 || check.includes(true)) {
								return;
							}
						} else {
							var track = res.tracks[0];
							player.queue.add(track);
							if (!player.playing && !player.paused && !player.queue.size) {
								return player.play();
							}
						}
				}
			}
		});
	}
}

exports.NodeConnectEvent = NodeConnectEvent;
