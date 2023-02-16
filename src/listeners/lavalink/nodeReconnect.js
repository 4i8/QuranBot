const { Listener, container } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class NodeReconnectEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'nodeReconnect'
		});
	}

	run(node) {
		this.container.logger.info(`NodeReconnected[${node.options.identifier}]`);
		hook(`NodeReconnected[${node.options.identifier}]`).error();
	}
}

exports.NodeReconnectEvent = NodeReconnectEvent;
