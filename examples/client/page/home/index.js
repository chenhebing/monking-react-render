import React, { PureComponent } from 'react';
import 'react-dom';
import { className } from './index.css';

export default class Home extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            count: 1
        };
    }
    handleClick () {
        this.setState({
            count: this.state.count + 2
        });
    }

    render () {
        return (
            <div className={className}>
                <button type="button" onClick={this.handleClick.bind(this)}>+</button>
                <span>{this.state.count}</span>
                <div>test3</div>
            </div>
        );
    }
}
