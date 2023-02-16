const { Listener, container } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class NodeDisconnectEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'nodeDisconnect'
		});
	}

	run(node, reason) {
		this.container.logger.warn(`NodeDisconnected[${node.options.identifier}]>>${reason.toString()}`);
		hook(`NodeDisconnected[${node.options.identifier}]>>${reason.toString()}`).error();
		this.container.logger.warn(reason);
	}
}

exports.NodeDisconnectEvent = NodeDisconnectEvent;
