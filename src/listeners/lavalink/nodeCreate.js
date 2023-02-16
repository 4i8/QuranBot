const { Listener, container } = require('@sapphire/framework');

class NodeCreateEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'nodeCreate'
		});
	}

	run(node) {
		this.container.logger.info(`NodeCreated[${node.options.identifier}]`);
	}
}

exports.NodeCreateEvent = NodeCreateEvent;
