const { Listener, container } = require('@sapphire/framework');
const { hook } = require('../../lib/utils/hook');

class TrackStuckEvent extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            emitter: container.client.manager,
            event: 'trackStuck'
        });
    }

    /**
     * 
     * @param {import('erela.js').Player} player 
     * @param {import('erela.js').Track} track 
     * @param {import('erela.js').TrackStuckEvent} playload 
     */
    async run(player, track, playload) {
        this.container.logger.error(`Stuck[${player.guild}]`);
		hook(`Stuck[${player.guild}]`).error();
        if (!player.voiceChannel) player.destroy();
    };
}

exports.TrackStuckEvent = TrackStuckEvent;
