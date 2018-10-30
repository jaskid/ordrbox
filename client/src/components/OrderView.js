import React, { Component } from 'react';
import Moment from 'react-moment';

// ACTIONS
import { stampOrder, cancelOrder, holdOrder, deleteOrder } from '../store/actions/order';

const ItemTable = ({items}) => {
    const itemTable = items.map((item, index) => (
        <tr key={index}>
            <td>{item.itemNum}</td>
            <td>{item.quantity}</td> 
            <td>{item.unitCost}</td>
        </tr>
    ));
    return itemTable;
};

const ItemDescriptions = ({items}) => {
    const itemTable = items.map((item, index) => (
        <tr key={index}>
            <td>{item.description}</td>
        </tr>
    ));
    return itemTable;
};

const ItemDeliveries = ({items}) => {
    const itemTable = items.map((item, index) => (
        <tr key={index}>
            <td><Moment className='text-muted' format='DD MMM YYYY'>
                {item.delivery}
            </Moment></td>
        </tr>
    ));
    return itemTable;
};

const ContactList = ({contacts}) => {
    const contactList = contacts.map((c, i) => (
        <li key={i} className={(2%i === 0) ? 'gray' : null}>
            <div className="section row space">
                <div>{c.name}:&nbsp;</div>
                <div>{c.email}</div>
            </div>
        </li>
    ));
    return contactList;
};

class OrderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stampNum: '',
            error: false,
            sent: false
        };
    }
    
    handleChange = e => {
        this.setState({stampNum: e.target.value});
    }
    
    // TODO: REFACTOR data into state on successful res, allowing to change the order's
    // status (hold, canceled, etc.) without reloading page.
    
    stampOrder = e => {
        e.preventDefault();
        this.setState({sent: true});
        if(this.state.stampNum.length < 1) { return }
        const { order } = this.props;
        stampOrder({orderid: order._id, groupid: order.group._id, stampid: this.state.stampNum}).then((res) => {
                console.log('ORDER STAMP SUCCESSFUL');
                this.props.loadFocus('done');
                this.props.handleClose();
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error, sent: false});
                return;
            });
    }
    
    cancelOrder(canceled) {
        this.setState({sent: true});
        const { order } = this.props;
        cancelOrder({orderid: order._id, groupid: order.group._id, canceled: canceled}).then((res) => {
                console.log('ORDER CANCEL SUCCESSFUL');
                this.props.reloadPage();
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error, sent: false});
                return;
            });
    }
    
    holdOrder(hold) {
        this.setState({sent: true});
        const { order } = this.props;
        holdOrder({orderid: order._id, groupid: order.group._id, hold: hold}).then((res) => {
                console.log('ORDER HOLD SUCCESSFUL');
                this.props.reloadPage();
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error, sent: false});
                return;
            });
    }
    
    deleteOrder() {
        this.setState({sent: true});
        const { order } = this.props;
        deleteOrder({orderid: order._id, groupid: order.group._id}).then((res) => {
                console.log('ORDER DELETE SUCCESSFUL');
                this.props.reloadPage();
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error, sent: false});
                return;
            });
    }
    
    render() {
        const { order, isAdmin, isSubmitter } = this.props;
        const { stampNum, error, sent } = this.state;
        return(
            <div className="order-view">
                {error && (
                    <div className="alert-box">{error.message}</div>
                )}
                {order.stamped && (
                    <div className="section row center floor"><h3>[ STAMPED ]</h3></div>
                )}
                {order.hold && (
                    <div className="section row center floor"><h4>This order is on hold.</h4></div>
                )}
                {order.canceled && (
                    <div className="section row center floor"><h3>[ CANCELED ]</h3></div>
                )}
                <div className="section row center">
                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <th>Description</th>
                            </tr>
                            <ItemDescriptions items={order.items}/>
                            </tbody>
                        </table>
                    </div>
                    <div className="items-table">
                        <table>
                            <tbody>
                            <tr>
                                <th>Item/PT#/Rev#</th>
                                <th>Qty</th> 
                                <th>Cost/Unit ($)</th>
                            </tr>
                            <ItemTable items={order.items}/>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <th>Delivery By</th>
                            </tr>
                            <ItemDeliveries items={order.items}/>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="order-info section col lightgray boxed">
                    <div className="section row hat floor">
                        <div className="section col center flex-8">
                            <div className="section row center floor"><strong>Vend Info:</strong></div>
                            <div className="section row">
                                <div className="flex-2"><strong>Vendor:&nbsp;</strong></div>
                                <div className="flex-8 section end">{order.metadata.vendor}</div>
                            </div>
                            <div className="section row gray">
                                <div className="flex-2"><strong>Quote#:&nbsp;</strong></div>
                                <div className="flex-8 section end">{order.metadata.quoteNum}</div>
                            </div>
                            <div className="section row">
                                <div className="flex-2"><strong>Requester:&nbsp;</strong></div>
                                <div className="flex-8 section end">{order.user.name}</div>
                            </div>
                            <div className="section row gray">
                                <div className="flex-2"><strong>Shipping:&nbsp;</strong></div>
                                <div className="flex-8 section end">{order.metadata.shipping}</div>
                            </div>
                            <div className="section row">
                                <div className="flex-2"><strong>Project:&nbsp;</strong></div>
                                <div className="flex-8 section end">{order.metadata.project ? order.metadata.project : 'N/A'}</div>
                            </div>
                        </div>
                        <div className="order-contact-list pad flex-4 section col start">
                            <div className="section row center floor"><strong>Contacts:</strong></div>
                            {(order.metadata.contacts.length > 0) ? (
                                <ul>
                                    <ContactList contacts={order.metadata.contacts}/>
                                </ul>
                            ) : (
                                <div>No contacts found!</div>
                            )}
                        </div>
                    </div>
                    {order.metadata.note ? (
                        <div className="section row floor">
                            <strong>Note:&nbsp;</strong>{order.metadata.note}
                        </div>
                    ) : null}
                </div>
                
                {!order.stamped ? (
                    <div className="order-options hat floor center">
                        {sent ? (
                            <div className='medium loading-wheel'>
                                <div id="spinner">
                                    <i className="fas fa-spinner"></i>
                                </div>
                            </div>
                        ) : (
                            <div className="section row center">
                                {isAdmin ? (
                                    <div className="section row space">
                                        <input
                                            type='text'
                                            className='flex-6'
                                            name='stampNum'
                                            value={stampNum}
                                            onChange={this.handleChange}
                                            placeholder='PR#'
                                            disabled={order.hold ? true : null}
                                        />
                                        <button
                                            className='btn small blue flex-2'
                                            onClick={this.stampOrder}
                                            disabled={order.hold ? true : null}>
                                            <i className="fas fa-stamp"></i>
                                        </button>
                                    </div>
                                ) : null }
                                {((isAdmin || isSubmitter) && (!order.hold && !order.canceled)) ? (
                                    <div className="">
                                        <button
                                            className='btn small yellow'
                                            onClick={() => this.holdOrder(true)}>
                                            HOLD
                                        </button>
                                    </div>
                                ) : null }
                                {((isAdmin || isSubmitter) && (order.hold && !order.canceled)) ? (
                                    <div className="">
                                        <button
                                            className='btn small yellow'
                                            onClick={() => this.holdOrder(false)}>
                                            REMOVE HOLD
                                        </button>
                                    </div>
                                ) : null }
                                {(isAdmin) ? (
                                    <div className="">
                                        <button
                                            className='btn small red'
                                            onClick={() => this.cancelOrder(true)}>
                                            CANCEL
                                        </button>
                                    </div>
                                ) : null}
                                {(isSubmitter && order.canceled) ? (
                                    <div className="">
                                        <button
                                            className='btn small red'
                                            onClick={this.deleteOrder}>
                                            Delete Order
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default OrderView;