import React from 'react';
import Item from './message-item';

import './App.css'


export default class Messages extends React.Component {
    render () {
        let {messages} = this.props;
        return (
            <ul className="messages clo-md-5">
                {messages.map((item, index) =>
                    <Item key={index} user={item.userId === this.props.user.id? true : false} message={item}/>
                )}   
            </ul>
        )
    }
}
