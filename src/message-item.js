import React from 'react';
import './App.css'
import avatar from './avatar.jpg'

const Item = (props) => {
        return (
            <li className={props.user  ? 'message right appeared' : 'message left appeared'}>
                <div className="avatar"><img src={avatar} alt="user" /></div>
                <div className="text_wrapper">
                    <div className="text"><b>{props.message.userName}</b><br></br>{props.message.message}</div>
                </div>
            </li>
        )
}

export default Item
