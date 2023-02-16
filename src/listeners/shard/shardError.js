const { Listener } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class ShardErrorEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options
		});
	}

	run(error, id) {
		this.container.logger.warn(`An error occurred in shard number [${id}]`);
		this.container.logger.error(error);
		hook(`An error occurred in shard number [${id}]`).shard('shardError');
	}
}

exports.ShardErrorEvent = ShardErrorEvent;
