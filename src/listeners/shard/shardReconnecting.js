const { Listener } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class ShardReconnectingEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options
		});
	}

	run(id) {
		this.container.logger.info(`Shard [${id}] reconnecting....`);
		hook(`Shard [${id}] reconnecting....`).shard('shardReconnecting');
	}
}

exports.ShardReconnectingEvent = ShardReconnectingEvent;
