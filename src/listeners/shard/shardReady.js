const { Listener } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class ShardReadyEvent extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options
        });
    }

    run(id) {
        this.container.logger.info(`Shard with id[${id}] is ready.`);
        hook(`Shard with id[${id}] is ready.`).shard('shardReady');
    }
}

exports.ShardReadyEvent = ShardReadyEvent;
