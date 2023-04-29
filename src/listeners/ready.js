const { Listener } = require('@sapphire/framework');
const { blue, gray, green, magenta, magentaBright, white, yellow } = require('colorette');
const { settings } = require('../config.json');
const { StartAzkar, StartKhutma } = require('../lib/utils/extc');
const guildSchema = require('../schema/guild.js');
const dev = process.env.NODE_ENV !== 'production';

class ReadyEvent extends Listener {
	style = dev ? yellow : blue;

	constructor(context, options = {}) {
		super(context, {
			...options,
			once: true,
			event: 'ready'
		});
	}

	run() {
		this.printBanner();
		this.printStoreDebugInformation();

		const { client, logger } = this.container;
		client.guilds.cache.forEach(async (guild) => {
			const FindGuild = await guildSchema.findOne({ guildID: guild.id });
			if (!FindGuild) {
				const newData = new guildSchema({
					guildID: guild.id
				});
				newData.save();
			} else {
				FindGuild.azkar
					.filter((r) => r.channelID !== null)
					.forEach(async (data) => {
						StartAzkar(Object.assign({ guildID: guild.id }, data));
					});
				FindGuild.khutma
					.filter((r) => r.channelID !== null)
					.forEach(async (data) => {
						StartKhutma(Object.assign({ guildID: guild.id }, data));
					});
			}
		});
		client.manager.init(client.user.id);
		logger.info(`${client.user.username} online!`);
		//Game
		client.user.setActivity(settings.Activity, { type: settings.Type });
	}

	printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop();

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	styleStore(store, last) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}

module.exports = {
	ReadyEvent
};
