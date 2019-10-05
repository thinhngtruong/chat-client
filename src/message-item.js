import React from 'react';
import './App.css'
import avatar from './avatar.jpg'

export default class Item extends React.Component {
    render() {
        return (
            <li className={this.props.user  ? 'message right appeared' : 'message left appeared'}>
                <div className="avatar"><img src={avatar} alt="user" /></div>
                <div className="text_wrapper">
                    <div className="text"><b>{this.props.message.userName}</b><br></br>{this.props.message.message}</div>
                </div>
            </li>
        )
    }
}
