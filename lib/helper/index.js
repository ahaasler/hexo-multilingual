"use strict";

module.exports = function(ctx) {
	var helper = ctx.extend.helper;

	helper.register("_c", require("./_c"));
};
