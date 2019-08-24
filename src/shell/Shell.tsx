import * as React from "react";
import App from "../react-quick-start/App";
import ListChooser from "./chooser/ListChooser";
import {CssBaseline} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import "./shell.scss";
import theme from "./theme";

export default function Shell() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ListChooser />
            <App />
        </ThemeProvider>
    );
}