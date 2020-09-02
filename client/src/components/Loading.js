import React, { Component } from "react";

class Loading extends Component {
  render() {
    return (
      <div>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <span id="spinnertext">Loading</span>
      </div>
    );
  }
}

export default Loading;
