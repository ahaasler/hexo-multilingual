"use strict";

var should = require("chai").should();
var Promise = require("bluebird");
var _ = require("lodash");

describe("post", function() {
	var Hexo = require("hexo");
	var hexo = new Hexo(__dirname, {
		silent: true
	});
	var Post = hexo.model("Post");
	var generator = Promise.method(require("../lib/generator/post").bind(hexo));

	hexo.config.permalink = ":title/";

	function locals() {
		hexo.locals.invalidate();
		return hexo.locals.toObject();
	}

	before(function() {
		return hexo.init();
	});

	it("default layout", function() {
		return Post.insert({
			source: "foo",
			slug: "bar"
		}).then(function(post) {
			return generator(locals()).then(function(data) {
				data.should.eql([{
					path: "bar/",
					layout: ["post", "page", "index"],
					data: _.extend({
						__post: true
					}, post)
				}]);

				return post.remove();
			});
		});
	});

	it("custom layout", function() {
		return Post.insert({
			source: "foo",
			slug: "bar",
			layout: "photo"
		}).then(function(post) {
			return generator(locals()).then(function(data) {
				data[0].layout.should.eql(["photo", "post", "page", "index"]);

				return post.remove();
			});
		});
	});

	it("layout disabled", function() {
		return Post.insert({
			source: "foo",
			slug: "bar",
			layout: false
		}).then(function(post) {
			return generator(locals()).then(function(data) {
				should.not.exist(data[0].layout);

				return post.remove();
			});
		});
	});

	it("prev/next post", function() {
		return Post.insert([{
			source: "foo",
			slug: "foo",
			date: 1e8
		}, {
			source: "bar",
			slug: "bar",
			date: 1e8 + 1
		}, {
			source: "baz",
			slug: "baz",
			date: 1e8 - 1
		}]).then(function(posts) {
			return generator(locals()).then(function(data) {
				should.not.exist(data[0].data.prev);
				data[0].data.next._id.should.eql(posts[0]._id);

				data[1].data.prev._id.should.eql(posts[1]._id);
				data[1].data.next._id.should.eql(posts[2]._id);

				data[2].data.prev._id.should.eql(posts[0]._id);
				should.not.exist(data[2].data.next);
			}).thenReturn(posts);
		}).map(function(post) {
			return post.remove();
		});
	});

	it("multilingual prev/next", function() {
		return Post.insert([{
			source: "one",
			slug: "one",
			date: 1e8,
			label: "post-one",
			lang: "en"
		}, {
			source: "uno",
			slug: "uno",
			date: 1e8,
			label: "post-one",
			lang: "es"
		}, {
			source: "two",
			slug: "two",
			date: 1e8 + 1,
			label: "post-two",
			lang: "en"
		}, {
			source: "dos",
			slug: "dos",
			date: 1e8 + 1,
			label: "post-two",
			lang: "es"
		}]).then(function(posts) {
			return generator(locals()).then(function(data) {
				// Post two
				data[0].data.source.should.eql("two");
				data[0].data.lang.should.eql("en");
				should.not.exist(data[0].data.prev);
				data[0].data.next.source.should.eql("one");
				data[0].data.next.lang.should.eql("en");
				// Post dos
				data[1].data.source.should.eql("dos");
				data[1].data.lang.should.eql("es");
				should.not.exist(data[1].data.prev);
				data[1].data.next.source.should.eql("uno");
				data[1].data.next.lang.should.eql("es");
				// Post one
				data[2].data.source.should.eql("one");
				data[2].data.lang.should.eql("en");
				data[2].data.prev.source.should.eql("two");
				data[2].data.prev.lang.should.eql("en");
				should.not.exist(data[2].data.next);
				// Post uno
				data[3].data.source.should.eql("uno");
				data[3].data.lang.should.eql("es");
				data[3].data.prev.source.should.eql("dos");
				data[3].data.prev.lang.should.eql("es");
				should.not.exist(data[3].data.next);
			}).thenReturn(posts);
		}).map(function(post) {
			return post.remove();
		});
	});

	it("multilingual alternates", function() {
		return Post.insert([{
			title: "one",
			source: "one",
			slug: "one",
			date: 1e8,
			label: "post-one",
			lang: "en"
		}, {
			title: "uno",
			source: "uno",
			slug: "uno",
			date: 1e8,
			label: "post-one",
			lang: "es"
		}, {
			title: "two",
			source: "two",
			slug: "two",
			date: 1e8 + 1,
			label: "post-two",
			lang: "en"
		}, {
			title: "dos",
			source: "dos",
			slug: "dos",
			date: 1e8 + 1,
			label: "post-two",
			lang: "es"
		}]).then(function(posts) {
			return generator(locals()).then(function(data) {
				// Post two
				data[0].data.source.should.eql("two");
				data[0].data.lang.should.eql("en");
				data[0].data.alternates.length.should.eql(2);
				data[0].data.alternates[0].title.should.eql("two");
				data[0].data.alternates[0].lang.should.eql("en");
				data[0].data.alternates[0].path.should.eql("two/");
				data[0].data.alternates[1].title.should.eql("dos");
				data[0].data.alternates[1].lang.should.eql("es");
				data[0].data.alternates[1].path.should.eql("dos/");
				// Post dos
				data[1].data.source.should.eql("dos");
				data[1].data.lang.should.eql("es");
				data[1].data.alternates.length.should.eql(2);
				data[1].data.alternates[0].title.should.eql("two");
				data[1].data.alternates[0].lang.should.eql("en");
				data[1].data.alternates[0].path.should.eql("two/");
				data[1].data.alternates[1].title.should.eql("dos");
				data[1].data.alternates[1].lang.should.eql("es");
				data[1].data.alternates[1].path.should.eql("dos/");
				// Post one
				data[2].data.source.should.eql("one");
				data[2].data.lang.should.eql("en");
				data[2].data.alternates.length.should.eql(2);
				data[2].data.alternates[0].title.should.eql("one");
				data[2].data.alternates[0].lang.should.eql("en");
				data[2].data.alternates[0].path.should.eql("one/");
				data[2].data.alternates[1].title.should.eql("uno");
				data[2].data.alternates[1].lang.should.eql("es");
				data[2].data.alternates[1].path.should.eql("uno/");
				// Post uno
				data[3].data.source.should.eql("uno");
				data[3].data.lang.should.eql("es");
				data[3].data.alternates.length.should.eql(2);
				data[3].data.alternates[0].title.should.eql("one");
				data[3].data.alternates[0].lang.should.eql("en");
				data[3].data.alternates[0].path.should.eql("one/");
				data[3].data.alternates[1].title.should.eql("uno");
				data[3].data.alternates[1].lang.should.eql("es");
				data[3].data.alternates[1].path.should.eql("uno/");
			}).thenReturn(posts);
		}).map(function(post) {
			return post.remove();
		});
	});
});
