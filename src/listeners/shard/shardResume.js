const { Listener } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class ShardResumeEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options
		});
	}

	run(id, replayedEvents) {
		this.container.logger.info(`Shard #${id} Resumed`);
		hook(`Shard #${id} Resumed`).shard('shardResume');
	}
}

exports.ShardResumeEvent = ShardResumeEvent;
