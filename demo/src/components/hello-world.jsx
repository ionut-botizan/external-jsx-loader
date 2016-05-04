const PageTitle = require('./page-title.js');

<div>
	<PageTitle name={this.state.who} />

	<input value={this.state.who} onChange={this.update} type="text" />
	<button onClick={this.greet}>Say hi!</button>
</div>
