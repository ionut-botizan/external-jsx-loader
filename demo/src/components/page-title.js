const React = require('react');
const view  = require('./page-title.jsx'); // require the template

class PageTitle extends React.Component {
	constructor(props) {
		super(props);
	}

	// some other stuff...

	render() {
		return view(this); // render the template passing `this` as the context
	}
}

module.exports = PageTitle;
