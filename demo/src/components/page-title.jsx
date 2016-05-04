let theTitle = 'Hello';

if (this.props.name !== '') {
	theTitle += ' ' + this.props.name;
}

theTitle += '!';

<div>
	<h1>{theTitle}</h1>
	<hr />
</div>
