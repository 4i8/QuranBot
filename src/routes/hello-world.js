const { methods, Route } = require('@sapphire/plugin-api');

class UserRoute extends Route {
	constructor(context, options) {
		super(context, {
			...options,
			route: 'hello-world'
		});
	}

	[methods.GET](_request, response) {
		response.json({ message: 'Hello World' });
	}

	[methods.POST](_request, response) {
		response.json({ message: 'Hello World' });
	}
}

module.exports = {
	UserRoute
};
