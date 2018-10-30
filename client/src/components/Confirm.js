import React from 'react';

const Confirm = (props) => {
    const { token } = props;
    
    if(token) {
        props
            .authConfirm(token)
            .then(res => {
                props.history.push(`/hub/user/${res.id}`);
            })
            .catch((err) => {
                console.log(err.message);
                props.history.push(`/hub`);
            });
    }
    return(
        <div className="section centered col">
            {token ? (
                <div>Processing confirmation...</div>
            ) : (
                <div>
                    <div className="section row">An email has been sent with a confirmation link. Please confirm your account!</div>
                    <div className="landing-icon"><i className="far fa-envelope"></i></div>
                </div>
            )}
        </div>
    );
};

export default Confirm;