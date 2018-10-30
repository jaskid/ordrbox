import React, { Component } from 'react';

export default class GroupForm extends Component {
    constructor(props) {
        super(props);
        let userid = this.props.currentUser.user.id;
        const confirm_password = this.props.createGroup ? '' : undefined;
        this.state = {
            name: '',
            handle: '',
            password: '',
            description: '',
            privacy: false,
            userid: userid,
            sent: false,
            error: '',
            confirm_password: confirm_password
        };
    }
    
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    
    handleSubmit = e => {
        e.preventDefault();
        this.setState({sent: true});
        const {sent, error, ...data} = this.state;
        this.props
            .onSubmit(data)
            .then(res => {
                this.props.history.push(`/hub/group/${res.id}`);
            })
            .catch(res => {
                console.log(res);
                this.setState({sent: false, error: res});
                return;
            });
    };
    
    
    render() {
        const {
            heading,
            buttonText,
            createGroup
        } = this.props;
        const { sent, error } = this.state;
        return(
            <div className="section center">
                <div className="auth-form">
                    <h2>{heading}</h2>
                    {error && (
                        <div className="alert-box">{error}</div>
                    )}
                    <form onSubmit={this.handleSubmit}>
                        {createGroup && (
                            <div>
                                <div className="section row">
                                    <label className="flex-4" htmlFor="name">Display Name:</label>
                                    <input
                                        className="flex-9"
                                        id="name"
                                        name="name"
                                        onChange={this.handleChange}
                                        type="text"
                                    />
                                </div>
                                <div className="section row end floor">
                                    <p className="footnote">Your group's display name will be how it's officially displayed in the hub (will be capitalized).</p>
                                </div>
                            </div>
                        )}
                        <div className="section row">
                            <label className="flex-4" htmlFor="handle">Handle:</label>
                            <input
                                className="flex-9"
                                id="handle"
                                name="handle"
                                onChange={this.handleChange}
                                type="text"
                            />
                        </div>
                        {createGroup && (
                            <div className="section row end floor">
                                <p className="footnote">Handles must be unique, have no spaces, and cannot use any special characters other than '-' and '_'.</p>
                            </div>
                        )}
                        <div className="section row hat">
                            <label className="flex-4" htmlFor="password">Password:</label>
                            <input
                                className="flex-9"
                                id="password"
                                name="password"
                                onChange={this.handleChange}
                                type="password"
                            />
                        </div>
                        {createGroup && (
                            <div>
                                <div className="section row space hat">
                                    <label className="flex-4" htmlFor="confirm_password">Confirm Password:</label>
                                    <input
                                        className="flex-9"
                                        id="confirm_password"
                                        name="confirm_password"
                                        onChange={this.handleChange}
                                        type="password"
                                    />
                                </div>
                                <div className="section row end floor">
                                    <p className="footnote">Must be at least 6 chars. and contain 1 uppercase, 1 lowercase, and 1 number.</p>
                                </div>
                                <div className="section col hat">
                                    <div className="section row">
                                        <label className="flex-4" htmlFor="description">Group Description:</label>
                                        <input
                                            className="flex-9 description-box"
                                            id="description"
                                            name="description"
                                            onChange={this.handleChange}
                                            type="text"
                                        ></input>
                                        
                                    </div>
                                    <div className="section row end floor">
                                        <p className="footnote">Optional. 100 chars max.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <hr/>
                        <div className="section row center">
                            {sent ? (
                                <div className='medium loading-wheel'>
                                    <div id="spinner">
                                        <i className="fas fa-spinner"></i>
                                    </div>
                                </div>
                            ) : (
                                <button type="submit" className="btn blue">
                                    {buttonText}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}