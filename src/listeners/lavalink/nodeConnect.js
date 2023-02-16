const { Listener, container } = require('@sapphire/framework');
const recoverySchema = require('../../schema/recovery');
const conveyor = require('tacs');
const extra = require('../../lib/utils/extra');
const { Permissions } = require('discord.js');
const { hook } = require('../../lib/utils/hook');
const guildSchema = require('../../schema/guild');
const moment = require('moment-timezone');
const wait = require('util').promisify(setTimeout);
class NodeConnectEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'nodeConnect'
		});
	}

	async run(node) {
		let ext = {
			num: 0,
			stats: false
		};
		const { client } = this.container;
		// client.manager.destroy();
		setTimeout(() => {
			this.container.logger.info(`Node "${node.options.identifier}" connected.`);
		}, 2000);
		//
		return; //Because there is no Lava Link server that can bear it, it has been disabled, hoping that your support will bring us a powerful server
		if (process.istest) return;
		process.cache.afk = true;
		await wait(process.istest ? 10 : 20000);
		process.cache.afk = false;
		//Get Recovery
		recoverySchema.find({}).then((all) => {
			all.forEach((res_guild) => {
				if (res_guild.latest.length <= 0 || !res_guild.latest.length) return;
				const guild = client.guilds.cache.get(res_guild.guildID);
				if (!guild) return;
				ext.num++;
				if (!process.cache.recovery[res_guild.guildID]) {
					process.cache.recovery[res_guild.guildID] = {
						stats: true
					};
				}
				// this.container.logger.info(`Recovery for ${res.guildID} added to queue.`);
				process.cache.tacs[res_guild.guildID] = new conveyor();
				process.cache.tacs[res_guild.guildID].$lab(async (element, index, remove) => {
					if (!process.cache.recovery[res_guild.guildID]) {
						process.cache.recovery[res_guild.guildID] = {
							stats: true
						};
					}
					let res;
					try {
						var User = await client.guilds.cache.get(element.guildId)?.members.fetch(element.requester);
						// var text = await client.guilds.cache.get(element.guildId)?.channels.cache.get(element.text);
						var voice = await client.guilds.cache.get(element.guildId)?.channels.cache.get(element.voice);
						if (!User) {
							User = await client.guilds.cache.get(element.guildId)?.me;
						}
					} catch (msg) {
						// this.container.logger.error(msg);
					}
					if (
						!User ||
						// !text ||
						!voice ||
						!voice
							.permissionsFor(client.user.id)
							.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK, Permissions.FLAGS.VIEW_CHANNEL])
					) {
						// this.container.logger.fatal(
						// 	`Recovery for ${element.guildId} failed.\nreason: \n${!User ? 'User not found' : ''}\n${
						// 		!text ? 'Text channel not found' : ''
						// 	}\n${!voice ? 'Voice channel not found' : ''}\n${
						// 		!voice
						// 			.permissionsFor(client.user.id)
						// 			.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK, Permissions.FLAGS.VIEW_CHANNEL])
						// 			? 'Missing permissions'
						// 			: ''
						// 	}`
						// );
						// hook(
						// 	`Recovery for ${element.guildId} failed.\nreason: \n${!User ? 'User not found' : ''}\n${
						// 		!text ? 'Text channel not found' : ''
						// 	}\n${!voice ? 'Voice channel not found' : ''}\n${
						// 		!voice
						// 			.permissionsFor(client.user.id)
						// 			.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK, Permissions.FLAGS.VIEW_CHANNEL])
						// 			? 'Missing permissions'
						// 			: ''
						// 	}`
						// ).error();
						setTimeout(() => {
							process.cache.tacs[res_guild.guildID].next().catch((e) => { });
						}, 1000);
						return;
					}
					const FindGuild = await guildSchema.findOne({
						guildID: res_guild.guildID
					});
					const player = client.manager.create({
						guild: element.guildId,
						textChannel: element.voice,
						voiceChannel: element.voice,
						selfDeafen: true,
						volume: FindGuild?.volume || 100
					});
					if (player.state != 'CONNECTED') await player.connect();
					player.setQueueRepeat(FindGuild?.loop || false);
					res = await player.search(`${element.identifier}`, User.user);
					if (res.loadType == 'NO_MATCHES' || res.loadType == 'LOAD_FAILED') {
						this.container.logger.fatal(`Recovery for ${element.guildId} failed. No matches found.`);
						hook(`Error when loading QuranAudio! Track is error in [${player.guild}]`).error();
						setTimeout(() => {
							process.cache.tacs[res_guild.guildID].next().catch((e) => { });
						}, 1000);
						return;
					}
					extra(res, {
						voice: element.voice,
						text: element.voice,
						title: element.title,
						recovery: true
					});
					setTimeout(() => {
						process.cache.tacs[res_guild.guildID]
							.next()
							.then(async () => {
								player.queue.add(res.tracks[0]);
								if (!player.playing && !player.paused && !player.queue.size) {
									player.play();
									if (element?.position) {
										player.seek(element.position);
									}
									// if (element?.messageID) {
									// 	try {
									// 		const Message = await client.guilds.cache
									// 			.get(element.guildId)
									// 			.channels.cache.get(element.text)
									// 			.messages.fetch(element.messageID);
									// 		if (Message?.id) Message.delete().catch((e) => {});
									// 	} catch {}
									// }
									return;
								}
							})
							.catch((e) => { });
					}, 30000);
				});
				process.cache.tacs[res_guild.guildID].on('end', () => {
					ext.num--;
					this.container.logger.info(`Recovery for ${res_guild.guildID} completed.`);
					delete process.cache.recovery[res_guild.guildID];
				});
				res_guild.latest.forEach((r) => {
					if (!r || r === null || r === 'null') return;
					process.cache.tacs[res_guild.guildID].add(Object.assign(r, { guildId: res_guild.guildID }));
				});
			});
			//This is a temporary fix for the recovery system.
			setInterval(async () => {
				if (ext.num > 0) return;
				if (!ext.stats) {
					this.container.logger.info(`recovery refresh started.`);
					ext.stats = true;
				}
				client.guilds.cache.forEach(async (guild) => {
					// const FindRecovry = await recoverySchema.findOne({
					// 	guildID: guild.id
					// });
					const Key = moment().tz('Asia/Riyadh').format('YYYY-MM-DD');
					const player = client.manager.get(guild.id);
					const CheckGuild = await client.guilds.cache.get(guild.id);
					if (!CheckGuild) return;
					if (player) {
						if (player.queue.current?.voice && (guild.me.voice.channelId !== null || guild.me.voice.channelId)) {
							player.queue.current.voice = guild.me.voice.channelId;
						}
						player.queue.map((track) => {
							track.voice = guild.me.voice.channelId;
						});
					}
					let load = !player
						? []
						: [
							Object.assign(
								{ position: player.position, messageID: !player?.MessagePlayer?.id ? null : player?.MessagePlayer?.id },
								player.queue.current
							)
						].concat(player.queue);
					if (load.length <= 0 || !player || !player.queue?.current || !player?.queue) return; //load.length <= 0 && FindRecovry?.key === Key
					await recoverySchema.findOneAndUpdate(
						{ guildID: guild.id },

						{
							$set: {
								latest: load.length > 0 ? load : [],
								key: Key
							}
						},
						{
							upsert: true
						}
					);
					// this.container.logger.info(`Recovery data for ${guild.name} has been updated.`);
				});
			}, 5000);
		});
	}
}

exports.NodeConnectEvent = NodeConnectEvent;
