import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../store/actions/auth';

class Navbar extends Component {
    logout = e => {
        e.preventDefault();
        this.props.logout();
    }
    render() {
        return(
            <div className="navbar">
                <div className="navbar-left">
                    <div className="navbar-brand">
                        <Link to="/" >
                            <span className='icon'>
                                <i className="fas fa-cookie-bite"></i>
                            </span>&nbsp;&nbsp;ORDRBOX
                        </Link>
                        {this.props.currentUser.isAuthenticated ? (
                        <Link to={`/hub/user/${this.props.currentUser.user.id}`}>HUB</Link>
                        ) : null }
                    </div>
                </div>
                {this.props.currentUser.isAuthenticated ? (
                    <div className="navbar-right">
                        <Link to={`/hub/user/${this.props.currentUser.user.id}`}>{this.props.currentUser.user.name}</Link>
                        <a href="/" onClick={this.logout}>Log Out</a>
                    </div>
                ) : (
                    <div className="navbar-right">
                        <Link to="/signup">Sign Up</Link>
                        <Link to="/signin">Log In</Link>
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps, { logout })(Navbar);