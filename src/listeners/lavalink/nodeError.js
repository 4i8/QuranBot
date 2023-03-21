const { Listener, container } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');
let i = -1;
class NodeErrorEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			emitter: container.client.manager,
			event: 'nodeError'
		});
	}

	run(node, error) {
		if (i++ < 5) return;
		this.container.logger.error(`NodeError[${node.options.identifier}]>>${error.message}`);
		hook(`NodeError[${node.options.identifier}]>>${error.message}`).error();
		this.container.logger.error(error);
	}
}

exports.NodeErrorEvent = NodeErrorEvent;
