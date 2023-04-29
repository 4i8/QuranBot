const { Listener } = require('@sapphire/framework');

class RateLimitEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options
		});
	}

	run(rateLimitData) {
		this.container.logger.error(rateLimitData);
	}
}

exports.RateLimitEvent = RateLimitEvent;
