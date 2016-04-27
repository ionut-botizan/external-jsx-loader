# external-jsx-loader
A webpack loader to be used with standalone JSX files, in order to separate the component's logic from its template.

---

## Install
```
npm install --save-dev external-jsx-loader
```
or (same thing, but shorter):
```
npm i -D external-jsx-loader
```

---

## Usage
1. Create your component's class same as before
2. Move the JSX tags from the `render()` method to a new file (Eg. `new-file.tpl.jsx`)
3. Require the new file (Eg. `const view = require('./new-file.tpl.jsx');`)
4. In the `render()` method, `return view(this);`
5. Configure webpack to use the `external-jsx` loader for the template files, based on the file extension you chose for your templates

---

## Webpack config
The easiest way is to configure it as a pre-loader:
```js
{
	module: {
		preLoaders: [
			{test: /\.tpl\.jsx$/, loader: 'external-jsx', exclude: /node_modules/}
		],

		loaders: [
			{test: /\.jsx$/, loader: 'babel', exclude: /node_modules/}
		]
	}
}
```
But you can configure it as a loader too:
```js
{
	module: {
		loaders: [
			{test: /\.tpl\.jsx$/, loader: 'babel!external-js', exclude: /node_modules/}
		]
	}
}
```
Either way, you have to make sure the loader is executed **before** the `babel` loader. (And yes, the `babel` loader will still have to be executed on the template files)

---

## Example
**File:** *MyComponent.jsx*
```js
const React = require('react');
const view  = require('./MyComponent.tpl.jsx'); // require the template

class MyComponent extends React.Component {
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

module.exports = MyComponent;
```

**File:** *MyComponent.tpl.jsx*
```jsx
<div>
	<h1>Hello!</h1>

	<input value={this.state.who} onChange={this.update} type="text" />
	<button onClick={this.greet}>Say hi!</button>
</div>
```

---

You can also `require` and use components in your template file or even have javascript code, just like before:
```jsx
const AnotherComponent = require('./path/to/another-component.js');

<AnotherComponent>
	{/*if*/ (this.state.on) ? (
		<span className="lights-on">ON</span>
	)/*else*/ : (
		<span className="lights-off">OFF</span>
	)/*endif*/}
</AnotherComponent>
```
*(the code you might have had in the `render()` method should be moved here if you really can't find a better place for it)*