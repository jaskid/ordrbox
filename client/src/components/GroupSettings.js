import React, { Component } from 'react';

import ProjectForm from '../components/ProjectForm';
import DeleteForm from '../components/DeleteForm';
import Modal from '../components/Modal';

const ProjectList = ({projects, openModal}) => {
    const projectList = projects.map((p, i) => (
        <li key={i}>
            <div className="section row space hat floor">
                <h3>#{p.name}&nbsp;</h3>
                <button className="btn small red" onClick={() => openModal(p.name, p._id)}><i className="fas fa-trash"></i></button>
            </div>
        </li>
    ));
    return projectList;
};

export default class GroupSettings extends Component {
    constructor(props) {
        super(props);
        const {group} = this.props;
        this.state = {
            showProjectForm: false,
            newName: group.name,
            newDescription: group.description,
            showModal: false,
            subjectName: '',
            projectid: ''
        };
        this.toggleProjectForm = this.toggleProjectForm.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(this.state.error && this.state.error === prevState.error) {
            this.setState({error: ''});
        }
    }
    
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    handleSubmit = e => {
        e.preventDefault();
        const { newName, newDescription } = this.state;
        const { group } = this.props;
        // check to see if a change has been made:
        if(newName === group.name && newDescription === group.description) {
            return;
        } else if(newName.length === 0) {
            return;
        } else if(newName.length > 16) {
            this.setState({error: 'Group names may not be longer than 16 characters.'});
            return;
        }
        this.props
            .editGroup(this.props.groupid, {name: newName, description: newDescription})
            .then(res => {
                this.props.reloadPage();
            })
            .catch(res => {
                console.log(res);
                this.setState({error: res});
                return;
            });
    }
    
    toggleProjectForm() {
        const current = this.state.showProjectForm;
        this.setState({showProjectForm: !current});
    }
    
    openModal(subjectName, projectid) {
        this.setState({subjectName: subjectName, projectid: projectid, showModal: true});
    }
    
    closeModal() {
        this.setState({showModal: false});
    }
    
    render() {
        const {
            createProject,
            deleteProject,
            deleteGroup,
            userid,
            groupid,
            group,
            history
        } = this.props;
        const {
            showProjectForm,
            subjectName,
            projectid,
            newName,
            newDescription,
            error
        } = this.state;
        
        return(
            <div className="settings section col display">
                {error && (
                    <div className="alert-box">{error}</div>
                )}
                <h2>Group Settings</h2>
                <div className="section row hat floor">
                    <label className="flex-2"><strong>Group Handle:</strong></label><div className="flex-8">{group.handle}</div>
                </div>
                <div className="section row hat floor">
                    <label className="flex-2" htmlFor="name"><strong>Group Name:</strong></label>
                    <input
                        className="flex-8"
                        name="newName"
                        value={newName}
                        onChange={this.handleChange}
                        type="text"
                    />
                </div>
                <div className="section row floor">
                    <label className="flex-2" htmlFor="description"><strong>Group Description:</strong></label>
                    <input
                        className="flex-8"
                        name="newDescription"
                        value={newDescription}
                        onChange={this.handleChange}
                        type="textarea"
                    />
                </div>
                <div className="section row hat floor end">
                    <button type="submit" onClick={this.handleSubmit} className="btn small blue">
                        Confirm Changes
                    </button>
                </div>
                
                <hr/>
                <div className="section col hat floor">
                    <div className="section row hat floor center">
                        <h3>Projects:</h3>
                    </div>
                    <div>
                        <ul id="settings-project-list">
                            <ProjectList
                                projects={group.projects}
                                openModal={this.openModal}
                            />
                        </ul>
                    </div>
                    {showProjectForm ? (
                        <ProjectForm
                            onSubmit={createProject}
                            reloadPage={this.props.reloadPage}
                            toggleForm={this.toggleProjectForm}
                            userid={userid}
                            groupid={groupid}
                        />
                    ) : (
                        <div className="section row hat floor center">
                            <button
                                name="settings-newProject"
                                className="btn blue"
                                onClick={this.toggleProjectForm}>
                                    <i className="fas fa-plus"></i>
                            </button>
                        </div>
                    )}
                </div>
                <div className="section row hat floor center">
                    <button
                        className="btn red"
                        onClick={() => this.openModal(group.name)}>
                            DELETE GROUP
                    </button>
                </div>
                <Modal show={this.state.showModal} handleClose={this.closeModal}>
                    <DeleteForm
                        subjectName={subjectName}
                        groupid={groupid}
                        projectid={projectid}
                        history={history}
                        onSubmit={projectid ? deleteProject : deleteGroup}
                        closeModal={this.closeModal}
                        reloadPage={this.props.reloadPage}
                    />
                </Modal>
            </div>
        );
    }
}