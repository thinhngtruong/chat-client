import React from 'react';
import SweetAlert from 'sweetalert-react';
import './sweetalert.css'
import './App.css'

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    }
  }


  checkEnter(e) {
    let { message } = this.state
    if (e.keyCode === 13) {
      if (message === '') {
        this.setState({
          showAlert: true
        })
      }
      else {
        this.props.sendMessage(message);
        this.setState({
          message: ''
        })
      }
    }
  }

  onClick = () => {
    let { message } = this.state
    if (message === '') {
      this.setState({
        showAlert: true
      })
    } else {
      this.props.sendMessage(message)
      this.setState({
        message: ''
      })
    }
  }

  onChange = (e) => {
    let target = e.target
    let name = target.name
    let value = target.value
    this.setState({
      [name]: value
    })
  }

  render() {
    let { message } = this.state
    return (
      <div>
        <div className="bottom_wrapper">
          <div className="message_input_wrapper">
            <input
              name="message"
              value={message}
              onChange={this.onChange}
              type="text"
              className="message_input"
              placeholder="Nhập nội dung tin nhắn"
              onKeyUp={this.checkEnter.bind(this)} />
          </div>
          <div className="send_message" onClick={() => this.onClick()} ref="inputMessage" >
            <div className='icon'></div>
            <div className='text'>Gửi</div>
          </div>
        </div>
        <SweetAlert
          show={this.state.showAlert}
          title="Thông báo"
          text="Nội dung tin nhắn không được trống!"
          type="warning"
          onConfirm={() => this.setState({ showAlert: false })}
        />
      </div>
    )
  }
}