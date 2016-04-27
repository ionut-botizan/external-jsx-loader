var Babylon = require('babylon');

module.exports = function(content) {
	var index = findViewStart(content);
	var logic = content.substr(0, index);
	var view  = content.substr(index);

	var source = `
		module.exports = function(context) {
			return (function() {
				${logic}

				if (!React) {
					var React = require("react");
				}

				return (
					${view}
				);
			}).apply(context);
		};
	`;

	this.cacheable && this.cacheable();

	return source;
}

function findViewStart(content) {
	var tagName;
	var token;
	var tokens = Babylon.parse(content, {plugins: ['jsx']}).tokens;
	var position = tokens.length;
	var depth = 0;

	while (token = tokens[--position]) {
		if (token.type.label !== 'jsxTagStart') {
			continue;
		}

		var tag = parseTag(position, tokens);

		// the last node in the source is a self-closing tag; use that
		if (!tagName && tag.self) {
			break;
		}

		// this is the last tag in the source; remember the name and find its pair
		if (!tagName) {
			tagName = tag.name;
			depth++;
			continue;
		}

		// ignore any tags with a different name
		if (tag.name !== tagName) {
			continue;
		}

		// increase depth for closing tags
		if (!tag.open) {
			depth++;
		}

		// decrease depth for opening (not self-closing) tags
		if (tag.open && !tag.self) {
			depth--;
		}

		// if depth reached 0, this must be the opening tag
		if (depth === 0) {
			break;
		}
	}

	token = tokens[position];

	return token ? token.start : 0;
}

function parseTag(position, tokens) {
	var token;
	var tag = {
		name : null,
		self : false,
		open : true
	};

	while (token = tokens[position++]) {
		// tag's end found so parsing must stop
		if (token.type.label === 'jsxTagEnd') {
			break;
		}

		// save the tag's name and continue parsing
		if (!tag.name && token.type.label === 'jsxName') {
			tag.name = token.value;
			continue;
		}

		// if a "/" is found after the tag's name, then it's a self-closing tag
		if (token.type.label === '/') {
			tag.self = tag.open = !!tag.name;
		}
	}

	return tag;
}
