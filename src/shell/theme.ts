import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {blue, purple} from "@material-ui/core/colors";

export default createMuiTheme({
    palette: {
        primary: blue,
        secondary: purple
    },
    typography: {
        // language=CSS prefix=body{font-family: suffix=;}
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        button: {
            textTransform: "none"
        }
    },
    props: {
        MuiListItem: {
            dense: true
        },
        MuiIconButton: {
            size: "small"
        },
        MuiFormControl: {
            margin: "dense"
        }
    }
});