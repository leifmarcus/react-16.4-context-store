import React from 'react';
import MainProvider, { MainConsumer } from '../stores/main.js';

export default class App extends React.Component {


    render() {
        return (
            <div>
                <MainProvider>
                    <MainConsumer>
                        <div>
                            <h1>{ state.test.title }</h1>
                            <p>{ state.test.text }</p>
                        </div>;
                    </MainConsumer>
                </MainProvider>
            </div>
        );
    }
}
