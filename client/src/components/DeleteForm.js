import React, { Component } from 'react';

export default class DeleteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirm_name: '',
            error: '',
            sent: false
        };
    }
    
    handleChange = e => {
        this.setState({confirm_name: e.target.value});
    }
    
    handleSubmit = e => {
        e.preventDefault();
        if(this.state.confirm_name !== this.props.subjectName) {
            this.setState({error: "Names don't match!"});
        } else {
            this.setState({sent: true});
            const { groupid, projectid } = this.props;
            this.props
                .onSubmit(groupid, projectid)
                .then((res) => {
                    // this.props.navigateTo(`/hub/group/${groupid}/project/${res.id}`);
                    if(projectid) {
                        this.props.reloadPage();
                    } else {
                        this.props.history.push(`/hub`);
                    }
                    console.log('DELETION SUCCESSFUL'); 
                })
                .catch((err) => {
                    this.setState({sent: false, error: err.message});
                });
        }
    }
    
    render() {
        const {subjectName, closeModal, projectid} = this.props;
        const {error} = this.state;
        return(
            <div className="deleteForm">
                {error && (
                    <div className="alert-box">{error}</div>
                )}
                <h3>Are you sure you want to delete {projectid ? '#' : null}{subjectName}?</h3>
                <p>This action is permanent and <strong>cannot be undone</strong>.
                To confirm deletion, please re-enter the name below:</p>
                {projectid ? (
                    <p>The project's orders won't be deleted - but the orders will no longer refer to a project.</p>
                ) : <p><strong>WARNING: This will permanently delete all orders made under this group.</strong></p>}
                <form onSubmit={this.handleSubmit}>
                    <div className="section row hat floor">
                        <label htmlFor="name">Enter Name to Confirm:</label>
                        <input
                            className="form-control"
                            id="name"
                            name="name"
                            onChange={this.handleChange}
                            type="text"
                        />
                        
                    </div>
                    <hr/>
                    <div className="section row floor space">
                        <button onClick={closeModal} className="btn blue">
                            Cancel
                        </button>
                        <button type="submit" className="btn red">
                            CONFIRM DELETE
                        </button>
                    </div>
                </form>
                
            </div>
        );
    }
}