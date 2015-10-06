"use strict";

module.exports = function(ctx) {
	var generator = ctx.extend.generator;

	generator.register("post", require("./post"));
};
