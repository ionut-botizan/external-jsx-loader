const React      = require('react');
const ReactDOM   = require('react-dom');

const HelloWorld = require('./components/hello-world.js');

const AppStart   = React.createFactory(HelloWorld);
const AppEntry   = document.querySelector('#app-entry');

ReactDOM.render(AppStart(), AppEntry);
