import React from 'react';

const ChatLine = (props) => {
	return (
		<div className="chatline">
			{props.user} says:<br/>{props.message}
		</div>
	);
};

export default ChatLine;