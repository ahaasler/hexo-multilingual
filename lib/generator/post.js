'use strict';

var _ = require('lodash');

module.exports = function(locals) {
	var posts = locals.posts.sort('-date').toArray();
	var length = posts.length;

	function getAlternatePosts(label) {
		var alternates = posts.filter(function(post) {
			return post.label == label;
		});
		var result = [];
		_.each(alternates, function(post) {
			result.push({
				title: post.title,
				lang: post.lang,
				path: post.path
			});
		});
		return result;
	}

	return posts.map(function(post, i) {
		var layout = post.layout;
		var path = post.path;

		if (!layout || layout === 'false') {
			return {
				path: path,
				data: post.content
			};
		} else {
			if (i) post.prev = posts[i - 1];
			if (i < length - 1) post.next = posts[i + 1];

			var layouts = ['post', 'page', 'index'];
			if (layout !== 'post') layouts.unshift(layout);

			if (post.label && post.lang) {
				post.alternates = getAlternatePosts(post.label);
			}

			return {
				path: path,
				layout: layouts,
				data: _.extend({
					__post: true
				}, post)
			};
		}
	});
};
