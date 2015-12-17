import React from 'react';

export default class Controls extends React.Component {
	onSubmit = (e) => {
		e.preventDefault();
		let message = this.refs.message;
		this.props.onSubmit(message.value);
		message.value = '';
	}
	render () {
		return (
			<form onSubmit={this.onSubmit}>
				<input ref="message" name="message" type="text" placeholder="Type something you doofus" />
				<button type="submit">Send yo</button>
			</form>
		);
	}
}