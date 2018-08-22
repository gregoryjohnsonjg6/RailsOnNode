import 'intersection-observer';
import 'babel-polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Route Path

function createStore(data) {

};

class Application extends Component {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>Hello World</div>
        );
    };
}

const dest = document.getElementById('app');
const store = createStore(window.STORE);

const application = (
    <Provider store={store}>
        {Application}
    </Provider>
);

ReactDOM.render(application, dest);

/* eslint-disable */
if (process.env.NODE_ENV !== 'production' && module.hot) {
	module.hot.accept([], () => {
		const newStore = createStore(window.STORE);

		const newApplication = (
			<Provider store={newStore}>
				{Application}
			</Provider>
        );
        
		ReactDOM.render(newApplication, dest);
	});
}
