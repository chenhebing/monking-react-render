import React, { Component } from 'react';
import { className } from './index.css';

export default class Home extends Component {
    constructor (props) {
        super(props);
        this.state = {
            count: 2
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
            </div>
        );
    }
}
