import React, { Component } from 'react';

export default class AuthForm extends Component {
    constructor(props) {
        super(props);
        const confirm_password = this.props.signUp ? '' : undefined;
        this.state = {
            email: '',
            firstname: '',
            surname: '',
            password: '',
            sent: false,
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
        let name = `${this.state.firstname} ${this.state.surname}`;
        let user = {
            email: this.state.email,
            name: name,
            password: this.state.password,
            confirm_password: this.state.confirm_password
        };
        const authType = this.props.signUp ? 'signup' : 'signin';
        this.props
            .onAuth(authType, user)
            .then(res => {
                this.props.history.push(`/hub/user/${res.id}`);
            })
            .catch(() => {
                this.setState({sent: false});
                return;
            });
    };
    
    
    render() {
        const { email } = this.state;
        const {
            heading,
            buttonText,
            signUp,
            errors
        } = this.props;
        const { sent } = this.state;
        return(
            <div className="section center">
                <div className="auth-form">
                    <h2>{heading}</h2>
                    {errors.message && (
                        <div className="alert-box">{errors.message}</div>
                    )}
                    <form onSubmit={this.handleSubmit}>
                        <div className="section row space">
                            <label className="flex-4" htmlFor="email">Email:</label>
                            <input
                                className="flex-9"
                                id="email"
                                name="email"
                                onChange={this.handleChange}
                                value={email}
                                type="text"
                            />
                        </div>
                        
                        <div className="section row space hat">
                            <label className="flex-4" htmlFor="password">Password:</label>
                            <input
                                className="flex-9"
                                id="password"
                                name="password"
                                onChange={this.handleChange}
                                type="password"
                            />
                        </div>
                        {signUp && (
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
                                <div className="section row space">
                                    <h3>Name:</h3>
                                    <div className="tooltip">
                                        <i className="far fa-question-circle"></i>
                                        <div className="tooltiptext">Your name will be how your admin
                                        and fellow users refer to you! Please use your real name.</div>
                                    </div>
                                </div>
                                <div className="section row space">
                                    <label className="flex-4" htmlFor="firstname">First:</label>
                                    <input
                                        className="flex-9"
                                        id="firstname"
                                        name="firstname"
                                        onChange={this.handleChange}
                                        type="text"
                                        placeholder=''
                                    />
                                </div>
                                <div className="section row space hat floor">
                                    <label className="flex-4" htmlFor="surname">Last:</label>
                                    <input
                                        className="flex-9"
                                        id="surname"
                                        name="surname"
                                        onChange={this.handleChange}
                                        type="text"
                                        placeholder=''
                                    />
                                </div>
                            </div>
                        )}
                        <hr/>
                        {sent ? (
                            <div className="section row center">
                                <div className='medium loading-wheel'>
                                    <div id="spinner">
                                        <i className="fas fa-spinner"></i>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="section row center">
                                <button type="submit" className="btn blue">
                                    {buttonText}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}