const { Listener } = require('@sapphire/framework');

class RawEvent extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options
        });
    }

    run(data) {
        this.container.client.manager.updateVoiceState(data);
    }
}

exports.RawEvent = RawEvent;
