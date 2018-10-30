import React, {Component} from 'react'
import { Link } from 'react-router-dom';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = { scrollY: window.scrollY };
    }
    componentDidMount() {
        window.onscroll = () => {
            if(window.scrollY < 700) {
                this.setState({scrollY: window.scrollY});
            }
        };
    }
    componentWillUnmount() {
        window.onscroll = () => {};
    }
    render() {
        const op = {opacity: Math.min(this.state.scrollY / 260, 1) };
        const pos1 = {transform: `translate(0, ${Math.max(-(this.state.scrollY - 360), 0)}px)` };
        const pos2 = {transform: `translate(0, ${Math.max(-(this.state.scrollY - 520), 0)}px)` };
        const pos3 = {transform: `translate(0, ${Math.max(-(this.state.scrollY - 700), 0)}px)` };
        const { currentUser } = this.props;
        return(
            <div className="landing">
                <div className="hero section">
                    <div className="content">
                        <div className="section row center">
                            <div className="title">ordrbox</div><sup>&nbsp;beta</sup>
                        </div>
                        <p className="subtitle">Be an order recorder, not an order hoarder.</p>
                        <div>
                            {!currentUser.isAuthenticated ? (
                                <div className="quick section row center">
                                    <Link to="/signup">
                                        <button className="sign-up btn">
                                            SIGN UP
                                        </button>
                                    </Link>
                                    <Link to="/signin">
                                        <button className="log-in btn">
                                            LOG IN
                                        </button>
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                
                <div style={op} className="description section col">
                    <div className="section row section-title">Say goodbye to a cluttered inbox, and hello to a tidy Ordrbox.</div>
                    <div className="section col">
                        <div style={pos1} className="article section flex-responsive center">
                            <div className="info">
                                Ordrbox is a <strong>lightweight, in-office purchase request management system</strong>.
                                Teams submit purchase requests to administrators in a <strong>cookie-cutter format</strong>
                                 - admins may then view the request in
                                a table to simply copy-paste into the&nbsp;
                                <div className="tooltip">
                                        PMIS
                                        <div className="tooltiptext">Procurement Management Information System.</div>
                                    </div>
                                &nbsp;of their choice.
                                Completed requests are <strong>stamped</strong> with a PR number for later reference.
                            </div>
                            <div className="landing-icon"><i className="fas fa-cookie-bite"></i></div>
                        </div>
                        <div style={pos2} className="article section flex-responsive center">
                            <div className="landing-icon"><i className="fas fa-layer-group"></i></div>
                            <p className="info">
                                All requests, including stamped ones, are stored in a secure database, where they always
                                live just one search away. Which means no more rummaging through eons-old emails for yesterday's
                                requests.
                            </p>
                        </div>
                        <div style={pos3} className="article section flex-responsive center">
                            <p className="info">
                                Requestr's hub is organized into <strong>Groups</strong> - anyone can start a group, and anyone given that Group's
                                password may join. Under <strong>Groups</strong>, admins may create individual <strong>Projects</strong>, under which requests may
                                be submitted. This allows for <strong>clean separation between teams, assignments, or fields in the workplace</strong>.
                            </p>
                            <div className="landing-icon"><i className="fas fa-chalkboard-teacher"></i></div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            
                <div className="highlights section col">
                    <div className="section row center section-title">Why use Ordrbox?</div>
                    <div className="section center row hat">
                        <div className="highlight bubble">
                            <div className="name">Lightning fast.</div>
                            <div className="blurb">
                            No more scouring eons-old emails. Ordrbox tracks
                            all requests for you, always just one search away.
                            </div>
                            <div className="landing-icon"><i className="fas fa-rocket"></i></div>
                        </div>
                        <div className="highlight bubble">
                            <div className="name">Robust security.</div>
                            <div className="blurb">
                            <a className="link" href="https://mlab.com">mLab</a>, our database hosting service,
                            provides secure hosting for companies like Lyft, Facebook, and SAP.
                            </div>
                            <div className="landing-icon"><i className="fas fa-shield-alt"></i></div>
                        </div>
                        <div className="highlight bubble">
                            <div className="name">Simply organized.</div>
                            <div className="blurb">
                            As an admin, view itemized requests in tables
                            - simply copy and paste into the PMIS of your choice.
                            </div>
                            <div className="landing-icon"><i className="fas fa-table"></i></div>
                        </div>
                    </div>
                </div>
                
                
                <div className="footer">
                    <div className="section col">
                        <div className="section row center hat">
                            Questions? Concerns? Requests? Contact me at:&nbsp;&nbsp;
                            <a className="link" href="mailto:jake@ordrbox.com">jake@ordrbox.com</a>
                        </div>
                        <div className="section row center hat">
                            Tips? Fork me on&nbsp;<a className="link">github&nbsp;<i className="fab fa-git-square"></i></a>
                        </div>
                    </div>
                </div>
            
            </div>
        );
    }
};

export default Landing;