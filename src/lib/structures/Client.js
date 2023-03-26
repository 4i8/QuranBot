const { SapphireClient } = require('@sapphire/framework');
const { Manager } = require('erela.js');

module.exports = class Client extends SapphireClient {
	/**
	 *
	 * @param {import("discord.js").ClientOptions} options
	 */
	constructor(options) {
		super(options);

		this.config = require('../../config.json');
		this.owner = this.config.settings.Owner_ID;
		this.prefix = this.config.settings.Prefix;
		this.emoji = this.config.emojis;
		this.color = this.config.colors;
		/**
		 *   Error Handler
		 */
		this.on('disconnect', () => console.log('Bot is disconnecting...'));
		this.on('reconnecting', () => console.log('Bot reconnecting...'));
		this.on('warn', (error) => console.log(error));
		this.on('error', (error) => console.log(error));
		process.on('unhandledRejection', (error) => console.log(error));
		process.on('uncaughtException', (error) => console.log(error));

		const that = this;
		//random number
		this.random = function (min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		};
		this.manager = new Manager({
			nodes: [this.config.settings.nodes[this.random(0, this.config.settings.nodes.length - 1)]],
			autoPlay: true,
			shards: this.shard ? this.shard.count : 1,
			send(id, payload) {
				const guild = that.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			}
		});
	}

	/**
	 *
	 * @param {string} token
	 */
	async connect(token) {
		await super.login(token);
	}
};
