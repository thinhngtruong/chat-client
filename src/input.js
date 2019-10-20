import React, { useState, useEffect } from "react";
import SweetAlert from 'sweetalert-react';
import './sweetalert.css'
import './App.css'
import io from 'socket.io-client';

const Input = (props) => {
  const [message, setMessageValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io('https://chat-server-2019.herokuapp.com'));
  }, []);

  const checkEnter = (e) => {
    if (e.keyCode === 13) {
      if (message === '') {
        setShowAlert(true)
      }
      else {
        props.sendMessage(message);
        setMessageValue('');
        socket.emit("stop-typing");
      }
    }
  }

  const onClick = () => {
    if (message === '') {
      setShowAlert(true)
    } else {
      props.sendMessage(message)
      setMessageValue('');
      socket.emit("stop-typing");
    }
  }

  const onChange = (e) => {
    let value = e.target.value
    if (value !== '') {
      socket.emit("typing", { user: props.user });
    }
    else {
      socket.emit("stop-typing");
    }
    setMessageValue(value)
  }

  return (
    <div>
      <div className="bottom_wrapper">
        <div className="message_input_wrapper">
          <input
            value={message}
            onChange={onChange}
            type="text"
            className="message_input"
            placeholder="Nhập nội dung tin nhắn"
            autoFocus={true}
            onKeyUp={checkEnter} />
        </div>
        <div className="send_message" onClick={onClick}>
          <div className='icon'></div>
          <div className='text'>Gửi</div>
        </div>
      </div>
      <SweetAlert
        show={showAlert}
        title="Thông báo"
        text="Nội dung tin nhắn không được trống!"
        type="warning"
        onConfirm={() => setShowAlert(false)}
      />
    </div>
  )
}

export default Input