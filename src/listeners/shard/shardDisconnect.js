const { Listener } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class ShardDisconnectEvent extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options
        });
    }

    run(event, id) {
        this.container.logger.warn(`Shard #${id} Disconnected`);
        hook(`Shard #${id} Disconnected`).shard('shardDisconnect');
    }
}

exports.ShardDisconnectEvent = ShardDisconnectEvent;
