import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {ReducerRegistry} from "./state/reducer";
import {Provider} from 'react-redux';
import {setupReducers} from "./shell/reducersetup";
import Shell from "./shell/Shell";

const registry = new ReducerRegistry();
setupReducers(registry);

const store = registry.createStore();

ReactDOM.render(<Provider store={store}><Shell /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();