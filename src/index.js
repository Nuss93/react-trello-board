import React from "react";
import ReactDOM from "react-dom";
import TaskList from "./views/TaskList";
// import '@atlaskit/css-reset';
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <TaskList />
  </React.StrictMode>,
  document.getElementById("root")
);
