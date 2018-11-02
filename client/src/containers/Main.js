import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// ACTIONS
import { authUser, authConfirm } from '../store/actions/auth';
import { createGroup, joinGroup } from '../store/actions/auth';
import { addAlert, removeAlert } from '../store/actions/alerts';
import { removeError } from '../store/actions/errors';

// COMPONENTS
import Landing from '../components/Landing';
import Confirm from '../components/Confirm';
import Hub from './Hub';
import AuthForm from '../components/AuthForm';
import GroupForm from '../components/GroupForm';
// import Alert from './Alert';
// import AlertsOverlay from '../components/AlertsOverlay';

const PrivateRoute = ({ render, currentUser, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (currentUser.isAuthenticated) ? (
                (currentUser.user.confirmed) ? (
                    render(props)
                ) : (
                    <Redirect
                        to={{
                            pathname: "/confirm",
                            state: { from: props.location }
                        }}
                    />
                )
            ) : (
                <Redirect
                    to={{
                        pathname: "/signin",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

const Main = props => {
    const { currentUser, authUser, authConfirm, errors, removeError, history } = props;
    return(
        <div className="con">
            <div>
                {/*
                <AlertsOverlay alerts={alerts} removeAlert={removeAlert}>
                    <Alert />
                </AlertsOverlay>
                */}
            </div>
            <Switch>
                <Route
                    exact path="/"
                    render={props => <Landing currentUser={currentUser} {...props}/>} />
                
                { /* ---[ VIEW SUBJECT ]--- */  }
                <PrivateRoute exact path='/hub/user/:userid' currentUser={currentUser} render={(props) => (
                    <Hub
                        {...props}
                        errors={errors}
                        currentUser={currentUser}
                        removeError={removeError}
                        history={history}
                        item='user'
                    />
                )}/>
                <PrivateRoute exact path='/hub/group/:groupid' currentUser={currentUser} render={(props) => (
                    <Hub
                        {...props}
                        errors={errors}
                        currentUser={currentUser}
                        removeError={removeError}
                        history={history}
                        item='group'
                    />
                )}/>
                <PrivateRoute exact path='/hub/group/:groupid/project/:projectid' currentUser={currentUser} render={(props) => (
                    <Hub
                        {...props}
                        errors={errors}
                        currentUser={currentUser}
                        removeError={removeError}
                        history={history}
                        item='project'
                    />
                )}/>

                { /* ---[ AUTH ROUTES ]--- */  }
                <Route
                    currentUser={currentUser}
                    exact path="/signin"
                    render={props =>
                    (currentUser.isAuthenticated) ? (
                            <Redirect
                                to={{
                                    pathname: `/hub/user/${currentUser.user.id}`,
                                    state: { from: props.location }
                                }}
                            />
                        ) : (
                            <AuthForm
                                onAuth={authUser}
                                errors={errors}
                                buttonText="Log in"
                                heading="Welcome back."
                                {...props}
                            />
                        )
                    } />
                <Route exact path="/signup" render={props => 
                        (currentUser.isAuthenticated) ? (
                            <Redirect
                                to={{
                                    pathname: `/hub/user/${currentUser.user.id}`,
                                    state: { from: props.location }
                                }}
                            />
                        ) : (
                            <AuthForm
                                onAuth={authUser}
                                signUp
                                errors={errors}
                                buttonText="Sign Up"
                                heading="Get started here."
                                {...props}
                            />
                        )
                    } />
                <PrivateRoute exact path="/hub/create" currentUser={currentUser} render={props => {
                    return(
                        <GroupForm
                            onSubmit={createGroup}
                            // removeError={removeError}
                            currentUser={currentUser}
                            errors={errors}
                            createGroup
                            buttonText="Create Group"
                            heading="Let's get this party started."
                            {...props}
                        />
                    );
                }} />
                <PrivateRoute exact path="/hub/join" currentUser={currentUser} render={props => {
                    return(
                        <GroupForm
                            onSubmit={joinGroup}
                            // removeError={removeError}
                            currentUser={currentUser}
                            errors={errors}
                            buttonText="Join Group"
                            heading="Join the party."
                            {...props}
                        />
                    );
                }} />
                <Route exact path="/confirm" render={props =>
                        (currentUser.user.confirmed) ? (
                            <Redirect
                                to={{
                                    pathname: `/hub/user/${currentUser.user.id}`,
                                    state: { from: props.location }
                                }}
                            />
                        ) : (
                            (currentUser.isAuthenticated) ? (
                                <Confirm/>
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: '/signin',
                                        state: { from: props.location }
                                    }}
                                />
                            )
                        )
                    } />
                <Route exact path="/confirm/:token" render={props => 
                        (currentUser.user.confirmed) ? (
                            <Redirect
                                to={{
                                    pathname: `/hub/user/${currentUser.user.id}`,
                                    state: { from: props.location }
                                }}
                            />
                        ) : (
                            (currentUser.isAuthenticated) ? (
                                <Confirm
                                    authConfirm={authConfirm}
                                    token={props.match.params.token}
                                    history={history}
                                    {...props}
                                />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: '/signin',
                                        state: { from: props.location }
                                    }}
                                />
                            )
                        )
                    } />
                <Redirect from="/hub" to={(currentUser.isAuthenticated && currentUser.user.confirmed) ? (`/hub/user/${currentUser.user.id}`) : ('/signin')} />
            </Switch>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        errors: state.errors,
        alerts: state.alerts
    };
}

export default withRouter(connect(mapStateToProps, {authConfirm, authUser, removeError, addAlert, removeAlert})(Main));