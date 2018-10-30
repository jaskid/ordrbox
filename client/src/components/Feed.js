import React from 'react';
import Ticket from './Ticket';

const Feed = ({orders, viewOrder}) => {
    if(orders) {
        // console.log('Building feed. Orders found:');
        // console.log(orders);
        let orderList = orders.map((o,i) => (
            <Ticket
                key={i}
                orderid={o._id.toString()}
                groupid={o.group}
                requester={o.user.name}
                vendor={o.metadata.vendor}
                quoteNum={o.metadata.quoteNum}
                project={o.project ? o.project.name : null}
                submitTime={o.submitTimestamp}
                stampTime={o.stampTimestamp}
                totalCost={o.metadata.extendedCost}
                viewOrder={viewOrder}
                hold={o.hold}
                canceled={o.canceled}
            />
        ));
        return orderList;
    } else {
        return [];
    }
};

export default Feed;