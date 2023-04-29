const [test] = process.argv.slice(2);
const buildStructure = require('./structure');
buildStructure().then((a) => {
	if (a.length) {
		throw a.join('\n');
	}
	process.istest = false;
	if (test === '--test') {
		process.istest = true;
		process.argv = process.argv.filter((arg) => arg !== '--test');
		require('./lib/setup');
		require('./config.json').settings.BOT_TOKEN = require('./config.json').settings.TEST_BOT_TOKEN;
	}
	const { LogLevel, container } = require('@sapphire/framework');
	const { settings } = require('./config.json');
	const Client = require('./lib/structures/Client');
	const mongoose = require('mongoose');
	mongoose
		.connect(settings.Mongo_DB, {
			dbName: 'quran'
			// keepAlive: true,
			// keepAliveInitialDelay: 10000
		})
		.then(async () => {
			process.cache = {
				await: [],
				recovery: [],
				cooldowns: [],
				tacs: [],
				interval: [],
				afk: false
			};
			const client = new Client({
				defaultPrefix: settings.Prefix,
				regexPrefix: /^(hey +)?bot[,! ]/i,
				caseInsensitiveCommands: true,
				logger: {
					level: LogLevel.Debug
				},
				intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_VOICE_STATES', 'GUILD_INTEGRATIONS'],
				partials: ['CHANNEL'],
				loadMessageCommandListeners: true,
				allowedMentions: {
					parse: ['everyone', 'roles', 'users'],
					repliedUser: false
				}
			});
			client.logger.info('Connect To MongoDB Successfully');
			const main = async () => {
				try {
					await client.connect(settings.BOT_TOKEN);
				} catch (error) {
					client.logger.fatal(error);
					client.destroy();
					process.exit(1);
				}
			};

			main();
		})
		.catch((err) => {
			throw new Error('Connect To MongoDB Failed' + `\n` + err);
		});
});
