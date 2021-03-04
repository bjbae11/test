import React, { Component } from "react";

import chatbotIcon from "./chatbot_icon.png";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
    };
    this.messageRef = React.createRef();
    this.scrollToEnd = this.scrollToEnd.bind(this);
  }

  scrollToEnd() {
    if (this.state.dataList.length > 0) {
      this.messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }

  componentDidMount() {
    this.setState({
      dataList: this.props.dataList,
    });
  }

  componentDidUpdate() {
    this.scrollToEnd();
  }

  render() {
    return (
      <div className="messages-chat">
        {this.state.dataList.map((data, idx) => {
          if ("result" in data) {
            return (
              <div className="message-caller" key={idx}>
                <div className="message text-only">
                  <div className="response">
                    <p className="text">{data.result}</p>
                  </div>
                </div>
                <p className="response-time time" ref={this.messageRef}>
                  {" "}
                  {data.datetime} &nbsp;&nbsp;&nbsp;&nbsp; {data.caller}
                </p>
              </div>
            );
          }
          if ("answer" in data) {
            return (
              <div className="message-polbot" key={idx}>
                <div className="message">
                  <div
                    className="photo"
                    style={{ backgroundImage: `url(${chatbotIcon})` }}
                  >
                    <div className="online"></div>
                  </div>
                  <p className="text">{data.answer}</p>
                </div>
                <p className="time" ref={this.messageRef}>
                  {" "}
                  {data.datetime}
                </p>
              </div>
            );
          }
        })}
      </div>
    );
  }
}
