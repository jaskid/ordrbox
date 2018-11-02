import React, { Component } from 'react';

export default class ProjectForm extends Component {
    constructor(props) {
        super(props);
        const { userid, groupid } = this.props;
        this.state = {
            name: '',
            groupid: groupid,
            userid: userid
        };
    }
    
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    
    handleSubmit = e => {
        e.preventDefault();
        // this.props.resetSettings();
        e.target.value = '';
        // let { groupid } = this.props;
        this.props
            .onSubmit(this.state)
            .then((res) => {
                // this.props.navigateTo(`/hub/group/${groupid}/project/${res.id}`);
                // this.props.history.push(`/hub/group/${groupid}/project/${res.id}`);
                this.props.reloadPage();
                console.log('PROJECT CREATE SUCCESSFUL');
            })
            .catch(() => {
                return;
            });
    };
    
    render() {
        return(
            <div className="project-form">
                <form onSubmit={this.handleSubmit}>
                    <div className="section row hat floor">
                        <label htmlFor="name"><strong>Project Name:</strong></label>
                        <input
                            className="form-control"
                            id="name"
                            name="name"
                            onChange={this.handleChange}
                            type="text"
                        />
                        
                        <button type="submit" className="btn blue">
                            <i className="fas fa-plus"></i>
                        </button>
                        <button onClick={this.props.toggleForm} className="btn blue">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </form>
                
            </div>
        );
    }
}