import React, { Component } from 'react';

class AlertsOverlay extends Component {
    render() {
        const {alerts, children, removeAlert} = this.props;
    
        const renderAlerts = function() {
            return alerts.map((alert, index) => {
                return React.cloneElement(children, {alert: alert, key: index, removeAlert: removeAlert});
            });
        };
        
        return (
            <div className="alerts-overlay">
                {renderAlerts()}
            </div>
        );
    }
}

export default AlertsOverlay;