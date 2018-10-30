import React, { Component } from 'react'
import { Link } from 'react-router-dom';

const ProjectList = props => {
    const projectList = props.projects.map((p,i) => (
        <li key={i}>
            <Link to={`/hub/group/${props.groupid}/project/${p._id}`} className="project">
                @{p.name}
            </Link>
        </li>
    ));
    return projectList;
};

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = { active: [] };
    }
    
    componentDidMount() {
        let active = [];
        this.props.groups.forEach(() => {
            active.push(true);
        });
        this.setState({ active: active });
    }
    
    toggleActive(i) {
        let active = this.state.active.slice();
        active[i] = !active[i];
        this.setState({active: active});
    }
    
    render() {
        const { groups } = this.props;
        const { active } = this.state;
        const groupItems = groups.map((g,i) => (
                <li key={i}>
                    <Link to={`/hub/group/${g.id}`} className="group">
                        {g.name}
                    </Link>&nbsp;&nbsp;
                    <button className="expand-arrow" onClick={() => this.toggleActive(i)}>
                        <i className={active[i] ? 'fas fa-angle-up' : 'fas fa-angle-down' }></i>
                    </button>
                    
                    {(g.projects.length) > 0 ? (
                        <ul className={active[i] ? 'project-list hide' : 'project-list show'}>
                            <ProjectList projects={g.projects} groupid={g.id} />
                        </ul>
                    ) : (
                        null
                    )}
                </li>
        ));
        return groupItems;
    }
}

const Sidebar = ({currentUser, groups}) => {
    return (
        <div className="sidebar">
            <ul className="top">
                <li>
                    <Link to={`/hub/user/${currentUser.user.id}`} className="user">
                        <i className="far fa-user-circle"></i>&nbsp;&nbsp;{currentUser.user.name}
                    </Link>
                </li>
                {groups ? (
                    <GroupList groups={groups}/>
                ) : null }
            </ul>
            
            <div className="bottom">
                <hr className="break"/>
                <ul>
                    <li>
                        <Link to={'/hub/create'} className="group">
                            <i className="fas fa-plus smaller"></i>&nbsp;&nbsp;Create Group
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hub/join'} className="group">
                            <i className="fas fa-sign-in-alt smaller"></i>&nbsp;&nbsp;Join Group
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;