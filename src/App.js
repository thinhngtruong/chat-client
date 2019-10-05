import React from 'react';
import $ from 'jquery';
import Messages from './message-list';
import Input from './input';
import _map from 'lodash/map';
import io from 'socket.io-client';
import SweetAlert from 'sweetalert-react';
import './sweetalert.css'
import './App.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        //Khởi tạo state,
        this.state = {
            messages: [], // danh sách tin nhắn
            user: { id: '', name: '' },// người dùng hiện tại, nếu rỗng sẽ hiển thị form login, có sẽ hiển thị phòng chat
            userOnline: [], // danh sách người dùng đang online
            showAlert: false
        }
        this.socket = null;
    }
    //Connetct với server nodejs, thông qua socket.io
    UNSAFE_componentWillMount() {
        this.socket = io('https://chat-server-2019.herokuapp.com/');
        this.socket.on('newMessage', (response) => { this.newMessage(response) }); //lắng nghe khi có tin nhắn mới
        this.socket.on('loginFail', (response) => { alert('Tên đã có người sử dụng') }); //login fail
        this.socket.on('loginSuccess', (response) => { this.setState({ user: { id: this.socket.id, name: response } }) }); //đăng nhập thành công 
        this.socket.on('updateUserList', (response) => { this.setState({ userOnline: response }) }); //update lại danh sách người dùng online khi có người đăng nhập hoặc đăng xuất

    }
    //Khi có tin nhắn mới, sẽ push tin nhắn vào state mesgages, và nó sẽ được render ra màn hình
    newMessage(m) {
        let messages = this.state.messages;
        let ids = _map(messages, 'id');
        let max = Math.max(...ids);
        messages.push({
            id: max + 1,
            userId: m.user.id,
            message: m.data,
            userName: m.user.name
        });
        let objMessage = $('.messages');
        this.setState({ messages });
        objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300); //tạo hiệu ứng cuộn khi có tin nhắn mới
    }
    //Gửi event socket newMessage với dữ liệu là nội dung tin nhắn
    sendnewMessage(m) {
        if (m) {
            this.socket.emit("newMessage", { data: m, user: this.state.user }); //gửi event về server
        }
    }
    //login để định danh người dùng
    login() {
        this.socket.emit("login", this.refs.name.value);
//         this.setState({
//             showAlert: true
//         })
    }

    render() {
        return (
            <div>
                <div className="app__content">
                    <h1>CHAT BOX</h1>
                    {/* kiểm tra xem user đã tồn tại hay chưa, nếu tồn tại thì render form chat, chưa thì render form login */}
                    {this.state.user.id && this.state.user.name ?
                        <div className="chat_window">
                            {/* danh sách user online */}
                            <div className="menu">
                                <span className="user-name">Username: {this.state.user.name}</span>
                                <div className="online-list">
                                    <p className="status">Đang Online: </p>
                                    {this.state.userOnline.map(item =>
                                        <li key={item.id}><span>{item.name}</span></li>
                                    )}
                                </div>
                            </div>
                            {/* danh sách message */}
                            <div className="content">
                                <Messages user={this.state.user} messages={this.state.messages} />
                                <Input sendMessage={this.sendnewMessage.bind(this)} />
                            </div>
                        </div>
                        :
                        <div className="login_form">{/* form login */}
                            <input type="text" name="name" ref="name"></input>
                            <input type="button" name="" value="Login" onClick={this.login.bind(this)}></input>
                        </div>
                    }
                </div>
//                 <SweetAlert
//                     show={this.state.showAlert}
//                     title="Thông báo"
//                     text="Đăng nhập thành công!"
//                     type="success"
//                     onConfirm={() => this.setState({ showAlert: false })}
//                 />
         </div>
        )
    }
}
