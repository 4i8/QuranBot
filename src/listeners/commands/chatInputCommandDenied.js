const { Listener, UserError, container, Events } = require('@sapphire/framework');
const { embed } = require('../../lib/structures/exports');
Events.RateLimit;
class CommandDeniedEvent extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			emitter: container.client,
			event: 'chatInputCommandDenied'
		});
	}
	/**
	 *
	 * @param {UserError} param0
	 * @param {import('@sapphire/framework').ChatInputCommandDeniedPayload} payload
	 * @returns
	 */
	async run({ context, message: content }, payload) {
		await payload.interaction.deferReply();
		if (Reflect.get(Object(context), 'silent')) return;
		return embed(payload.interaction, content, 'e', {
			interaction: {
				stats: true
			}
		});
	}
}

module.exports = {
	CommandDeniedEvent
};
