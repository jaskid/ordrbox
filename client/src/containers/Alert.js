import React, { Component } from 'react';
import {connect} from 'react-redux';

class Alert extends Component {
    constructor(props) {
        super(props);
        this.removeA = this.removeA.bind(this);
    }
    removeA() {
        const { alert, removeAlert } = this.props;
        removeAlert(alert.id);
    }
    
    render() {
        const { alert } = this.props;
        return (
            <div className={`alert ${alert.event}`} key={alert.id}>
                <div className="section row space">
                    <div>
                        {alert.text}
                    </div>
                    <div className="close-alert" onClick={this.removeA}>
                        <i className="fa fa-times"></i>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Alert);