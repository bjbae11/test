import "./App.css";
import React, { useState, useEffect, Component } from "react";
import Chat from "./chat/Chat";
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Chat />
      </div>
    );
  }
}
