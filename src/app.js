import React from 'react';
import request from 'superagent';

import ChatLine from './chatline';
import Controls from './controls';
import Loginout from './loginout';

const socket = io();

export default class App extends React.Component {
	state = {
		user: null,
		messages: []
	};
	receiveMessage = (message) => {
		console.log(`Received message:`)
		console.log(message);
		this.setState({
			messages: this.state.messages.concat([{user: message.user, text: message.text}])
		});
	};
	sendMessage = (message) => {
		socket.emit('message', { user: this.state.user, text: message });
	};
	checkLogin = () => {
		request.get('/user').end((err, res) => {
			if (!err) {
				this.setState({
					user: res.body.displayName
				});
			} else {
				this.setState({
					user: null
				});
			}
		});
	};
	componentDidMount () {
		socket.on('message', this.receiveMessage);
		this.checkLogin();
	}
	render () {
		const ChatLines = this.state.messages.map(message => {
			return (
				<ChatLine key={Math.random(1000)} user={message.user} message={message.text} />
			);
		});
		if (this.state.user) {
			return (
				<section id="app">
					<h1>Chatapp</h1>
					<Loginout loggedin={!!this.state.user} />
					<Controls onSubmit={this.sendMessage} />
					{ChatLines}
				</section>
			);
		} else {
			return (
				<section id="app">
					<h1>Chatapp</h1>
					<Loginout loggedin={!!this.state.user} />
				</section>
			);
		}
		
	}
}