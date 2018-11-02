import React, { Component } from 'react';
import { connect } from 'react-redux';

// ACTIONS
import { queryOrders, createOrder, removeOrders, fetchOrder, removeOrder } from '../store/actions/order';
import { createProject, deleteProject } from '../store/actions/project';
import { editGroup, deleteGroup } from '../store/actions/auth';

// COMPONENTS
import OrderForm from './OrderForm';
import OrderView from '../components/OrderView';
import Modal from '../components/Modal';
import GroupSettings from '../components/GroupSettings';
import Feed from '../components/Feed';
import Header from '../components/Header';

class Subject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: 'vendor',
            searchValue: '',
            selection: 'feed-new',
            stamped: false,
            canceled: false,
            prevQueryValue: '',
            showModal: false,
            modalContent: {}
        };
        this.onSearch = this.onSearch.bind(this);
        this.viewOrder = this.viewOrder.bind(this);
        this.loadFocus = this.loadFocus.bind(this);
    }
    
    componentDidMount() {
        this.props.removeOrders();
        this.props.queryOrders({stamped: false}, this.props.params);
        // this.setState({searchKey: 'vendor'});
    }
    
    // SEARCH BAR INPUT
    handleChange = e => {
        switch(e.target.name) {
            case 'searchKey':
                this.setState({searchKey: e.target.value, searchValue: ''});
                break;
            case 'searchValue':
                this.setState({searchValue: e.target.value});
                break;
            default:
                this.setState({[e.target.name]: e.target.value});
                break;
        }
    }
    
    onSearch(val) {
        // TODO: canceled
        if(val !== this.state.prevQueryValue) {
            this.setState({prevQueryValue: val});
            const { searchKey, searchValue, stamped } = this.state;
            const query = {
                key: searchKey,
                value: searchValue,
                stamped: stamped
            };
            this.props.queryOrders(query, this.props.params);
        }
    }
    
    changeFocus = e => {
        // TODO: check to make sure the selection is authorized (isAdmin, isGroup, isUser)
        // There's other checks elsewhere - but just in case
        this.setState({searchKey: '', searchValue: ''});
        this.props.removeOrders();
        switch(e.currentTarget.name) {
            case 'feed-new':
                this.props.queryOrders({stamped: false}, this.props.params);
                this.setState({selection: 'feed-new', stamped: false, canceled: false});
                break;
            case 'feed-done':
                this.props.queryOrders({stamped: true}, this.props.params);
                this.setState({selection: 'feed-done', stamped: true, canceled: false});
                break;
            case 'settings':
                this.setState({selection: 'settings'});
                break;
            case 'newOrder':
                this.setState({selection: 'newOrder'});
                break;
            case 'canceled':
                this.props.queryOrders({canceled: true}, this.props.params);
                this.setState({selection: 'feed-canceled', canceled: true});
                break;
            case 'alerts':
                this.setState({selection: 'alerts'});
                break;
            default:
                console.log('Error: Reached default focus.');
                this.props.queryOrders({stamped: false}, this.props.params);
                this.setState({selection: 'feed-new', stamped: false, canceled: false});
                break;
        }
    }
    
    loadFocus(focus) {
        if(focus === 'new') {
            this.props.queryOrders({stamped: false}, this.props.params);
            this.setState({selection: 'feed-new', stamped: false, searchKey: '', searchValue: ''});
        } else if(focus === 'done') {
            this.props.queryOrders({stamped: true}, this.props.params);
            this.setState({selection: 'feed-done', stamped: true, searchKey: '', searchValue: ''});
        }
    }
    
    viewOrder(groupid, orderid) {
        this.props.fetchOrder(groupid, orderid);
        this.setState({ showModal: true });
    }
    
    closeModal = () => {
        // TODO: fix - remove order not working
        this.props.removeOrder();
        this.setState({ showModal: false });
    }
    
    render() {
        const {
            subject,
            orders,
            currentUser,
            params,
            errors,
            order,
            history,
            subjectType
        } = this.props;
        const { selection, searchKey, searchValue } = this.state;
        
        // TODO: Timeout load if server not responding.
        return(
            <div className='subject'>
                <div>
                    <Header
                        title={subject.name}
                        numMembers={subject.numMembers}
                        parentGroup={subject.parentGroup}
                        alerts={subject.alerts ? subject.alerts.length : null}
                        handleChange={this.handleChange}
                        onSearch={this.onSearch}
                        searchKey={searchKey}
                        searchValue={searchValue}
                        changeFocus={this.changeFocus}
                        selection={selection}
                        isAdmin={subject.admin}
                        isGroup={(subjectType === 'group')}
                        isUser={(subjectType === 'user')}
                        isProject={(subjectType === 'project')}
                        inbox={orders.length}
                    />
                    <div id="subject-display">
                        {errors.message && (
                            <div className="alert-box">{errors.message}</div>
                        )}
                        {(selection.slice(0,4) === 'feed') ? (
                            <Feed orders={orders} viewOrder={this.viewOrder}/>
                        ) : null}
                        {(selection.split(' ')[0] === 'settings') ? (
                            <GroupSettings
                                createProject={createProject}
                                deleteProject={deleteProject}
                                editGroup={editGroup}
                                deleteGroup={deleteGroup}
                                userid={currentUser.user.id}
                                groupid={params.groupid}
                                history={history}
                                group={subject}
                                reloadPage={this.props.reloadSubject}
                            />
                        ) : null}
                        {(selection === 'newOrder') ? (
                            <OrderForm
                                onSubmit={createOrder}
                                userid={currentUser.user.id}
                                groupid={params.groupid}
                                projectid={params.projectid}
                                projects={subject.projects}
                                loadFocus={this.loadFocus}
                            />
                        ) : null}
                    </div>
                </div>
                <Modal show={this.state.showModal} handleClose={this.closeModal}>
                    {order.isLoaded ? (
                        <OrderView
                            order={order}
                            isAdmin={subject.admin}
                            isSubmitter={(order.user._id === currentUser.user.id)}
                            loadFocus={this.loadFocus}
                            reloadPage={this.props.reloadSubject}
                            handleClose={this.closeModal}
                        />
                    ) : (
                        <div className="section row center">
                            <div className='medium loading-wheel'>
                                <div id="spinner">
                                    <i className="fas fa-spinner"></i>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.orders,
        order: state.order
    };
};

export default connect(mapStateToProps, {queryOrders, fetchOrder, removeOrders, removeOrder})(Subject);