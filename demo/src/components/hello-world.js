const React = require('react');
const view  = require('./hello-world.jsx'); // require the template

class HelloWorld extends React.Component {
	constructor(props) {
		super(props);

		this.state  = {who: 'World'};
		this.greet  = this.greet.bind(this);
		this.update = this.update.bind(this);
	}

	greet(evt) {
		alert(`Hello ${this.state.who}`);
	}

	update(evt) {
		this.setState({who: evt.target.value});
	}

	render() {
		return view(this); // render the template passing `this` as the context
	}
}

module.exports = HelloWorld;
