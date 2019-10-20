import React from 'react';
import Item from './message-item';
import typing from './typing.gif'
import $ from 'jquery'
import './App.css'


const Messages = (props) => {
    let { typingMessage, messages } = props
    function displayMessage(){
        if (typingMessage === '') {
            return (
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
    return (
        <ul className="messages clo-md-5">
            {messages.map((item, index) =>
                <Item key={index} user={item.userId === props.user.id ? true : false} message={item} />
            )}
            {displayMessage()}
        </ul>
    )
}

export default Messages