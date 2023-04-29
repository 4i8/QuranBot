const { Listener } = require('@sapphire/framework');
const { Guild } = require('discord.js');
const { hook } = require('../../lib/utils/hook.js');
const guildSchema = require('../../schema/guild.js');
const recoverySchema = require('../../schema/recovery.js');
class guildCreate extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options
		});
	}

	/**
	 *
	 * @param {Guild} guild
	 */
	async run(guild) {
		const { client } = this.container;
		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
		];

		Promise.all(promises)
			.then(async (results) => {
				const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
				const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
				const Queue = await recoverySchema.find({}).then((r) => r.reduce((acc, data) => acc + data.latest.length, 0));
				hook(
					`**Guild: \`${guild.id}\` - ${guild.name}\nmembers: ${guild.memberCount}\nBOT:\nServer count: ${totalGuilds}\nMember count: ${totalMembers}\nQueue: \`${Queue}\`**`
				).join();
			})
			.catch(() => {
				hook(`**Guild: \`${guild.id}\` - ${guild.name}\nmembers: ${guild.memberCount}**`).join();
			});
		const data = await guildSchema.findOne({ guildID: guild.id });
		if (!data) {
			const newData = new guildSchema({
				guildID: guild.id
			});
			newData.save();
		}
	}
}

exports.guildCreate = guildCreate;
