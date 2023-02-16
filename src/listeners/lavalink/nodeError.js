const { Listener, container } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class NodeErrorEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'nodeError'
		});
	}

	run(node, error) {
		this.container.logger.error(`NodeError[${node.options.identifier}]>>${error.message}`);
		hook(`NodeError[${node.options.identifier}]>>${error.message}`).error();
		this.container.logger.error(error);
	}
}

exports.NodeErrorEvent = NodeErrorEvent;
