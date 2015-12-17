import React from 'react';

const Loginout = (props) => {
	if (props.loggedin) {
		return (
			<a href="/logout">Log out</a>
		);
	} else {
		return (
			<a href="/auth/google">Log in</a>
		);
	}
};

export default Loginout;