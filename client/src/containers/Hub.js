import React, { Component } from 'react';
import { connect } from 'react-redux';

// ACTIONS
import { fetchUserGroups } from '../store/actions/userGroups';
import { fetchSubject, removeSubject } from '../store/actions/subject';
// import { removeOrders } from '../store/actions/order';

// COMPONENTS/CONTAINERS
import Subject from './Subject';
import Sidebar from '../components/Sidebar';

class Hub extends Component {
    constructor(props) {
        super(props);
        // TODO: is this needed (navigateTo)?:
        this.navigateTo = this.navigateTo.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }
    fetchData() {
        this.props.fetchUserGroups(this.props.currentUser.user.id);
        this.props.removeSubject();
        let { params } = this.props.match;
        this.props.fetchSubject(params);
    }
    componentDidMount() {
        this.fetchData();
    }
    componentDidUpdate(prevProps) {
        // compare subjects by param ids to detect a route change:
        let newSubj = this.props.match.params[`${this.props.item}id`];
        let oldSubj = prevProps.match.params[`${prevProps.item}id`];
        // console.log(`Comparing: ${newSubj} to ${oldSubj}`);
        if(oldSubj !== newSubj) {
            this.fetchData();
        }
    }
    
    navigateTo(location) {
        console.log('navigatin?');
        this.props.history.push(location);
    }
    
    render() {
        const {
            subject,
            userGroups,
            currentUser,
            item,
            orders,
            errors,
            removeError,
            history
        } = this.props;
        history.listen(() => {
            removeError();
        });
        return(
            <div className='hub'>
                <Sidebar
                    currentUser={currentUser}
                    groups={userGroups}
                />
                {subject.isLoaded ? (
                    <Subject
                        errors={errors}
                        currentUser={currentUser}
                        subject={subject}
                        history={history}
                        params={this.props.match.params}
                        orders={orders}
                        sendQuery={this.props.queryOrders}
                        subjectType={item}
                        navigateTo={this.navigateTo}
                        reloadSubject={this.fetchData}
                    />
                ) : (
                    <div className='subject'>
                        <div className='loading-wheel'>
                            <div id="spinner">
                                <i className="fas fa-spinner"></i>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        subject: state.subject,
        userGroups: state.userGroups
    };
};

const dispatch = {
    fetchSubject,
    removeSubject,
    fetchUserGroups
};

export default connect(mapStateToProps, dispatch)(Hub);