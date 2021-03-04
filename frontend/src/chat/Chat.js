import React, { Component } from "react";

import "./Chat.css";
import chatbotIcon from "./chatbot_icon.png";
import io from "socket.io-client";

import Messages from "./Messages";
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callerList: [],
      calleeList: [],
      dataList: [],
      writtenMessage: "",
      isSocketOn: false,
      // discussions section style
      discussionsVisibility: "hidden",
      discussionsWidth: "0px",
      searchbarVisibility: "hidden",
      showDiscBtnStyle: { color: "black", cursor: "pointer" },
    };
  }

  componentWillUnmount() {
    this.socket.on("disconnect", () => {
      this.socket.close();
    });

    // remove resizeListener
    window.removeEventListener("resize", this.fixDiscussionsWidth.bind(this));
    console.log("component unmounted");
  }

  componentDidMount() {
    // add resize Listener
    this.fixDiscussionsWidth();
    window.addEventListener("resize", this.fixDiscussionsWidth.bind(this));

    const sensorEndpoint = "http://221.168.32.165:5000";
    this.socket = io.connect(sensorEndpoint, {
      reconnection: true,
      withCredentials: true,
    });
    console.log("component mounted");

    if (this.state.isSocketOn === false) {
      this.socket.on("connect", () => {
        this.socket.emit("my event", {
          data: "Polbot Admin Connected!!!",
        });

        this.socket.on("my response", (res) => {
          console.log(res);
          this.setState({
            isSocketOn: true,
          });
        });
      });
    }
    this.handleSocketData();
  }

  handleSocketData() {
    this.socket.on("my chat", (res) => {
      console.log(">>>>> my-chat");
      console.log(res);
      let tmpList = this.state.dataList;

      let currentTime = new Date();
      let hour = currentTime.getHours();
      let minutes = currentTime.getMinutes();
      let min = "";
      let hr = "";
      if (minutes < 10) {
        min = "0" + String(minutes);
      } else {
        min = String(minutes);
      }
      if (hour < 10) {
        hr = "0" + String(hour);
      } else {
        hr = String(hour);
      }
      let tmpItem = {
        answer: null,
        intent: null,
        uuid: null,
        datetime: hr + ":" + min,
      };

      // tmpList.push(res);
      tmpItem.answer = res.answer;
      tmpItem.intent = res.intent;
      tmpItem.uuid = res.uuid;
      tmpList.push(tmpItem);

      let callerList = this.state.callerList;
      let calleeList = this.state.calleeList;

      if (!callerList.includes(res.caller)) {
        callerList.push(res.caller);
      }

      if (!calleeList.includes(res.callee)) {
        calleeList.push(res.callee);
      }

      this.setState({
        callerList: callerList,
        calleeList: calleeList,
        dataList: tmpList,
      });
      console.log(">>>>>>> new this.state.callerList");
      console.log(this.state.callerList);
    });

    this.socket.on("my stt", (res) => {
      console.log(">>>>> my-stt");
      // console.log(res);
      let tmpList = this.state.dataList;

      let currentTime = new Date();
      let hour = currentTime.getHours();
      let minutes = currentTime.getMinutes();
      let min = "";
      let hr = "";
      if (minutes < 10) {
        min = "0" + String(minutes);
      } else {
        min = String(minutes);
      }
      if (hour < 10) {
        hr = "0" + String(hour);
      } else {
        hr = String(hour);
      }
      let tmpItem = {
        callee: null,
        caller: null,
        result: null,
        uuid: null,
        datetime: hr + ":" + min,
      };

      // tmpList.push(res);
      tmpItem.callee = res.callee;
      tmpItem.caller = res.caller;
      tmpItem.result = res.result;
      tmpItem.uuid = res.uuid;
      tmpList.push(tmpItem);

      this.setState({
        dataList: tmpList,
      });
    });
  }

  fixDiscussionsWidth() {
    if (this.state.discussionsVisibility === "visible") {
      if (window.innerWidth >= 768) {
        this.setState({
          discussionsWidth: "412px",
        });
      } else {
        this.setState({
          discussionsWidth: "280px",
        });
      }
    }
  }

  showDiscussions() {
    if (this.state.discussionsVisibility === "hidden") {
      this.setState({
        discussionsVisibility: "visible",
        showDiscBtnStyle: { color: "lightgray", cursor: "default" },
      });
      if (window.innerWidth >= 768) {
        this.setState({
          discussionsWidth: "412px",
        });
      } else {
        this.setState({
          discussionsWidth: "280px",
        });
      }
      setTimeout(() => {
        this.setState({
          searchbarVisibility: "visible",
        });
      }, 100);
    }
  }

  hideDiscussions() {
    if (this.state.discussionsVisibility === "visible") {
      this.setState({
        discussionsVisibility: "hidden",
        discussionsWidth: "0px",
        searchbarVisibility: "hidden",
        showDiscBtnStyle: { color: "black", cursor: "pointer" },
      });
    }
  }

  onChange = (e) => {
    let message = e.target.value;
    console.log(message);
    this.setState({
      writtenMessage: message,
    });
  };

  onEnterKeyDown = (e) => {
    if (e.key === "Enter") {
      let message = e.target.value.trim();
      if (message === "") {
        console.log("empty message");
        return;
      }

      let tmpList = this.state.dataList;
      let currentTime = new Date();
      let hour = currentTime.getHours();
      let minutes = currentTime.getMinutes();
      let data = {
        callee: "None",
        caller: "None",
        result: message,
        uuid: "None",
        datetime: String(hour) + ":" + String(minutes),
      };
      tmpList.push(data);

      this.setState({
        dataList: tmpList,
        writtenMessage: "",
      });
    }
  };

  writeMessage = (e) => {
    let writtenMessage = this.state.writtenMessage.trim();
    if (writtenMessage === "") {
      console.log("empty message");
      return;
    }

    let currentTime = new Date();
    let hour = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let data = {
      callee: "None",
      caller: "None",
      result: writtenMessage,
      uuid: "None",
      datetime: String(hour) + ":" + String(minutes),
    };

    let tmpList = this.state.dataList;
    tmpList.push(data);
    this.setState({
      dataList: tmpList,
      writtenMessage: "",
    });
  };

  render() {
    const dataList = this.state.dataList;

    return (
      <div>
        <div className="main d-flex flex-row">
          {/* menu */}
          <nav className="menu">
            <ul className="items">
              <li
                className="item item-active"
                onClick={(e) => {
                  e.preventDefault();
                  alert("clicked nav menu item");
                }}
              >
                <i className="fa fa-commenting" aria-hidden="true"></i>
              </li>
            </ul>
          </nav>

          {/* discussions */}
          <section
            className="discussions"
            style={{
              visibility: this.state.discussionsVisibility,
              width: this.state.discussionsWidth,
              transition: "0.3s",
            }}
          >
            <div className="discussion search">
              <div
                className="searchbar"
                style={{
                  visibility: this.state.searchbarVisibility,
                }}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
                <input type="text" placeholder="Search..."></input>
              </div>
              <i
                className="hide-disc-button icon clickable fa fa-times"
                aria-hidden="true"
                style={{
                  visibility: this.state.discussionsVisibility,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  this.hideDiscussions();
                }}
              ></i>
            </div>

            <div className="disc-msg-container">
              {this.state.callerList.map((caller, idx) => {
                return (
                  <div className="discussion message-active" key={idx}>
                    <div className="desc-contact d-flex align-items-center">
                      <p className="name">{caller}</p>
                    </div>
                    <div className="dropdown">
                      <i
                        className="dropdown-icon clickable fa fa-ellipsis-v"
                        data-toggle="dropdown"
                        aria-hidden="true"
                        aria-haspopup="true"
                        aria-expanded="false"
                      ></i>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <p className="dropdown-item">세션전환</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* chat */}
          <section className="chat">
            <div className="header-chat">
              <i
                className="show-disc-button icon clickable fa fa-bars"
                aria-hidden="true"
                style={this.state.showDiscBtnStyle}
                onClick={(e) => {
                  e.preventDefault();
                  this.showDiscussions();
                }}
              ></i>
              <p className="name">POLBOT 182 AI연락센터</p>
              {/* <i className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i> */}
            </div>
            <Messages dataList={dataList} />
            <div className="footer-chat">
              <input
                type="text"
                className="write-message"
                onChange={this.onChange}
                value={this.state.writtenMessage}
                onKeyDown={this.onEnterKeyDown}
                placeholder="Type your message here"
              ></input>
              <i
                className="icon send fa fa-paper-plane-o clickable"
                aria-hidden="true"
                onClick={(e) => {
                  e.preventDefault();
                  this.writeMessage();
                }}
              ></i>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
