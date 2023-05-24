import React from "react";
import ReactDOM from "react-dom";
import Board from "./views/Board";
import App from "./views/App";
// import '@atlaskit/css-reset';
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "firebase";

import { firebaseConfig } from './config.js'
import Main from "./layouts/Main";

import "./assets/css/index.scss";

// console.log(firebaseConfig)
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);