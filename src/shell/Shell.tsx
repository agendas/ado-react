import * as React from "react";
import App from "../react-quick-start/App";
import ListChooser from "./chooser/ListChooser";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./shell.scss";

export default function Shell() {
    return (
        <React.Fragment>
            <ListChooser />
            <App />
        </React.Fragment>
    );
}