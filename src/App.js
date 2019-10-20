import React, { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import Messages from './message-list';
import Input from './input';
import _map from 'lodash/map';
import io from 'socket.io-client';
import SweetAlert from 'sweetalert-react';
import './sweetalert.css'
import './App.css';
import avatar from './avatar.jpg'

const App = () => {
    const [messages, setMessagesValue] = useState([]);
    const [user, setUserValue] = useState({ id: '', name: '' });
    const [userOnline, setUserOnlineValue] = useState([]);
    const [showAlert, setShowAlertValue] = useState(false);
    const [typingMessage, setTypingMessageValue] = useState('');
    const socket = io('https://chat-server-2019.herokuapp.com');
    let name = useRef();

        //Connetct với server nodejs, thông qua socket.io
        useEffect(() => {
            //Khi có tin nhắn mới, sẽ push tin nhắn vào state mesgages, và nó sẽ được render ra màn hình
            function newMessage(m) {
                let ids = _map(messages, 'id');
                let max = Math.max(...ids);
                messages.push({
                    id: max + 1,
                    userId: m.user.id,
                    message: m.data,
                    userName: m.user.name
                });
                let objMessage = $('.messages');
                setMessagesValue(messages);
                objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300); //tạo hiệu ứng cuộn khi có tin nhắn mới
            }
        socket.on('newMessage', (response) => { newMessage(response) }); //lắng nghe khi có tin nhắn mới
        socket.on('dangnhap', (response) => { setTypingMessageValue(response) });
        socket.on('dungnhap', (response) => { setTypingMessageValue(response) });
        socket.on('loginFail', (response) => { alert('Tên đã có người sử dụng') }); //login fail
        socket.on('loginSuccess', (response) => {
            setUserValue({ id: socket.id, name: response });
            setShowAlertValue(true)
        }); //đăng nhập thành công 
        socket.on('updateUserList', (response) => { setUserOnlineValue(response) }); //update lại danh sách người dùng online khi có người đăng nhập hoặc đăng xuất
    }, [])

    //Gửi event socket newMessage với dữ liệu là nội dung tin nhắn
    const sendnewMessage = (m) => {
        if (m) {
            socket.emit("newMessage", { data: m, user: user }); //gửi event về server
        }
    }
    //login để định danh người dùng
    const login = () => {
        socket.connect();
        socket.emit("login", name.current.value);
    }

    const onLogOut = () => {
        socket.emit("disconnect");
        socket.disconnect();
        setUserValue({
            id: '',
            name: ''
        })
    }

    return (
        <div>
            <div className="app__content">
                <h1>CHAT BOX</h1>
                {/* kiểm tra xem user đã tồn tại hay chưa, nếu tồn tại thì render form chat, chưa thì render form login */}
                {user.id && user.name ?
                    <div className="chat_window">
                        {/* danh sách user online */}
                        <div className="menu">
                            <div className="user-name">Username: {user.name}</div>
                            <div className="btnCenter">
                                <input className="logoutButton" type="button" name="" value="Đăng xuất" onClick={onLogOut} />
                            </div>
                            <div className="online-list">
                                <p className="status">Đang Online: </p>
                                {userOnline.map(item =>
                                    <li className="onlUser" key={item.id}><span>{item.name}</span></li>
                                )}
                            </div>
                        </div>
                        {/* danh sách message */}
                        <div className="content">
                            <Messages user={user} messages={messages} typingMessage={typingMessage} />
                            <Input sendMessage={sendnewMessage} user={user.name} />
                        </div>
                    </div>
                    :
                    <div className="wrapper fadeInDown">
                        <div id="formContent">
                            <img src={avatar} alt="user" />
                            <h1>Nhập tên hiển thị</h1>
                            <input autoFocus={true} type="text" id="login" className="fadeIn first inputUsername" ref={name} />
                            <input type="button" className="fadeIn second loginButton" name="" value="Đăng nhập" onClick={login} />
                        </div>
                    </div>
                }
            </div>
            <SweetAlert
                show={showAlert}
                title="Thông báo"
                text="Đăng nhập thành công!"
                type="success"
                onConfirm={() => setShowAlertValue(false)}
            />
        </div>
    )
}

export default App
