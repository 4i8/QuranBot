const { WebhookClient, MessageEmbed } = require('discord.js');
const config = require('../../config.json');
function hook(content) {
	if (!content) throw new Error('No content provided');
	return {
		commands: () => {
			const hook = new WebhookClient({
				url: config.Webhooks.use_commands
			});
			hook.send({
				embeds: [new MessageEmbed().setTitle('Command Used').setDescription(content).setColor(config.colors.Primary).setTimestamp()]
			});
		},
		leave: () => {
			const hook = new WebhookClient({
				url: config.Webhooks.server_leave
			});
			hook.send({
				embeds: [new MessageEmbed().setTitle('Leave Guild').setDescription(content).setColor(config.colors.Primary).setTimestamp()]
			});
		},
		join: () => {
			const hook = new WebhookClient({
				url: config.Webhooks.server_join
			});
			hook.send({
				embeds: [new MessageEmbed().setTitle('Join Guild').setDescription(content).setColor(config.colors.Primary).setTimestamp()]
			});
		},
		error: () => {
			const hook = new WebhookClient({
				url: config.Webhooks.catch
			});
			hook.send({
				embeds: [new MessageEmbed().setTitle('Error').setDescription(content).setColor(config.colors.Error).setTimestamp()]
			});
		},
		shard: (type) => {
			const hook = new WebhookClient({
				url: config.Webhooks[type]
			});
			hook.send({
				embeds: [new MessageEmbed().setTitle(type).setDescription(content).setColor(config.colors.Warn).setTimestamp()]
			});
		}
	};
}
exports.hook = hook;
