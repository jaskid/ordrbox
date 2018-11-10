import React from 'react';
import Moment from 'react-moment';

const Ticket = (props) => {
    const {
        viewOrder,
        groupid,
        orderid,
        requester,
        vendor,
        quoteNum,
        project,
        submitTime,
        stampTime,
        totalCost,
        hold,
        canceled
    } = props;
    return(
        <div className={canceled ? 'ticket section row canceled' : 'ticket section row'}>
                <div className="section col flex-10 ticket-info">
                    <div className="vend-info section row space">
                        <div>{vendor} <span className="quote-num">#{quoteNum}</span></div>
                        {totalCost ? (<div>${totalCost}</div>) : null }
                    </div>
                    <div className="section row space">
                        <div className="submission-info">{requester}{project ? (<span className="info-proj">&nbsp;@{project}</span>) : null}&nbsp;-&nbsp;
                            <span className="text-muted">
                                {/*stampTime ? "Stamped: " : "Submitted: "*/}
                                <Moment date={ stampTime ? (new Date(stampTime)) : (new Date(submitTime)) } calendar />
                            </span>
                        </div>
                        { canceled ? (
                            <div className="section row tag red">CANCELED</div>
                        ) : null }
                        { hold ? (
                            <div className="section row tag yellow">HOLD</div>
                        ) : null }
                    </div>
                </div>
                <div className="section col flex-1 view-order">
                    <button className="btn blue" onClick={() => viewOrder(groupid, orderid)}>
                        <i className="far fa-eye"></i>
                    </button>
                </div>
            
        </div>
    );
};

export default Ticket;