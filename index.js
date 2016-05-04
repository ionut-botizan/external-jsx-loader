/**
 * This source code is licensed under the MIT License found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Copyright (c) 2016 Ionuț Botizan
 */

"use strict";

const Tokenizer  = require('babylon');
const TokenTypes = {
	TagStart : Tokenizer.tokTypes.jsxTagStart,
	TagEnd   : Tokenizer.tokTypes.jsxTagEnd,
	TagClose : Tokenizer.tokTypes.slash,
	TagName  : Tokenizer.tokTypes.jsxName
};

/**
 * The way this module works is:
 * - find the view's node tree starting position
 *
 * - split the source code in two parts: the view's logic (external
 *   dependencies, variables definitions, etc.) and the actual view (the JSX
 *   node tree)
 *
 * - build a function that executes the logic part and returns the view
 *
 * - build a module that exports a function which, when executed, returns the
 *   result of executing the previously built function in a custom context.
 *   This context is provided in the render method of the React component being
 *   rendered and is usually the component's instance (so you can use the `this`
 *   keyword in your views).
 */
module.exports = function(content) {
	const index  = getViewRoot(content);
	const logic  = content.substr(0, index);
	const view   = content.substr(index);
	const config = getConfig(this.query);
	const source = `
		module.exports = function(context) {
			return (function() {
				${logic}

				${!config.globalReact ? (
					`if (!React) {
						var React = require("react");
					}`
				):''}

				return (
					${view}
				);
			}).apply(context);
		};
	`;

	this.cacheable && this.cacheable();

	return source;
}

/**
 * Get the loader configuration (query) as an object
 */
function getConfig(query) {
	let config = query;

	if (typeof config === 'string') {
		try {
			config = JSON.parse(config.replace(/^\?/, ''));
		} catch(ex) {}
	}

	if (typeof config !== 'object') {
		config = {};
	}

	return config;
}

/**
 * Parse the view's source code and return an array of tokens
 */
function parse(source) {
	return Tokenizer.parse(source, {
		plugins: ['jsx']
	}).tokens;
}

/**
 * Finds the position of the opening JSX tag in the source code.
 */
function getViewRoot(source) {
	const tokens = parse(source);

	let position = tokens.length;
	let tagDepth = 0;
	let tagName;
	let token;

	/**
	 * Loop backwards through the view's source and find the last closing tag
	 * and its matching opening tag to determine the view's root node position.
	 */
	while (token = tokens[--position]) {
		if (token.type !== TokenTypes.TagStart) {
			continue;
		}

		let tag = parseTag(position, tokens);

		// the last node in the source is a self-closing tag; use that
		if (!tagName && tag.self) {
			break;
		}

		// this is the last tag in the source; save the name and find its pair
		if (!tagName) {
			tagName = tag.name;
			tagDepth++;
			continue;
		}

		// ignore any tags with a different name
		if (tag.name !== tagName) {
			continue;
		}

		// increase tags' depth in the tree for closing tags
		if (!tag.open) {
			tagDepth++;
		}

		// decrease tags' depth in the tree for opening (not self-closing) tags
		if (tag.open && !tag.self) {
			tagDepth--;
		}

		// if the tag's depth reached 0, it means this is the opening tag
		if (tagDepth === 0) {
			break;
		}
	}

	token = tokens[position];

	return token ? token.start : 0;
}

/**
 * Parses the name and type (opening, closing, self-closing) of a tag
 * at a given position in a set of tokens.
 */
function parseTag(position, tokens) {
	let token;
	let tag = {
		name : null,
		self : false,
		open : true
	};

	while (token = tokens[position++]) {
		// tag's end found so parsing must stop
		if (token.type === TokenTypes.TagEnd) {
			break;
		}

		// save the tag's name and continue parsing
		if (!tag.name && token.type === TokenTypes.TagName) {
			tag.name = token.value;
			continue;
		}

		// if a "/" is found after the tag's name, then it's a self-closing tag
		if (token.type === TokenTypes.TagClose) {
			tag.self = tag.open = !!tag.name;
		}
	}

	return tag;
}
