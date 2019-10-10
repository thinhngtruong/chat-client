import React from 'react';
import Item from './message-item';
import typing from './typing.gif'
import $ from 'jquery'
import './App.css'


export default class Messages extends React.Component {
    displayMessage = () => {
        let { typingMessage } = this.props
        if (typingMessage === '') {
            return(
                null
            )
        }
        else {
            let objMessage = $('.messages');
            objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
            return (
                <div>
                    <img src={typing} className="typing" alt="typing" />  
                    <span className="typing-message"> &nbsp;{typingMessage}</span>
                </div>
            )
        }
    }
    render() {
        let { messages } = this.props;
        return (
            <ul className="messages clo-md-5">
                {messages.map((item, index) =>
                    <Item key={index} user={item.userId === this.props.user.id ? true : false} message={item} />
                )}
                {this.displayMessage()}
            </ul>
        )
    }
}
