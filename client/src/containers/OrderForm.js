import React, { Component } from 'react';

const Items = ({items, handleChange, checkCots, minDate}) => {
    const itemList = items.map((item, index) => {
        let padIndex = (index+1) < 10 ? "0" + (index+1) : index+1;
        return(
            <li className="order-form-item boxed lightgray hat floor" key={index}>
                <h4>Item {padIndex}</h4>
                <div className="section row hat">
                    <div className="section col">
                        <div className="section row hat floor">
                            <label className="flex-1" htmlFor={`item ${index} itemNum`}>Part#/Rev:</label>
                            <input
                                className="flex-10"
                                name={`item ${index} itemNum`}
                                onChange={handleChange}
                                type="text"
                                placeholder="Part#/Rev"
                            />
                        </div>
                        <div className="section row hat floor">
                            <label className="flex-1" htmlFor={`item ${index} description`}>Description:</label>
                            <input
                                className="flex-10"
                                name={`item ${index} description`}
                                onChange={handleChange}
                                type="text"
                                placeholder="Description"
                            />
                        </div>
                        <div className="section row hat floor">
                            <div className="section row">
                                <label htmlFor="unitCost">Unit Cost:</label>
                                $&nbsp;<input
                                    name={`item ${index} unitCost`}
                                    onChange={handleChange}
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="section row">
                                <label htmlFor={`item ${index} quantity`}>Quantity:</label>
                                x&nbsp;<input
                                    name={`item ${index} quantity`}
                                    onChange={handleChange}
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                />
                            </div>
                            <div className="section row">
                                <label htmlFor={`item ${index} unitCost`}>Deliver By:</label>
                                <input
                                    name={`item ${index} delivery`}
                                    onChange={handleChange}
                                    type="date"
                                    min={minDate}
                                />
                            </div>
                            <div className="section row">
                                <label htmlFor={`item ${index} itemNum`}>COTS:</label>
                                <input className="checkbox" name={`${index}`} type="checkbox" onClick={checkCots}/>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        );
    });
    return itemList;
};

const ProjectSelector = ({projects}) => {
    const projectList = projects.map((p, i) => (
        <option key={i} value={p._id}>{p.name}</option>
    ));
    return projectList;
};

const Contacts = ({contacts, handleChange}) => {
    const contactList = contacts.map((c, i) => (
        <li key={i} className="section row hat">
            <label htmlFor={`contact ${i} name`}>Name:</label>
            <input
                name={`contact ${i} name`}
                onChange={handleChange}
                type="text"
                placeholder="Name"
            />
            <label htmlFor={`contact ${i} email`}>Email:</label>
            <input
                name={`contact ${i} email`}
                onChange={handleChange}
                type="email"
                placeholder="Email"
            />
        </li>
    ));
    return contactList;
};

export default class OrderForm extends Component {
    constructor(props) {
        super(props);
        const groupid = this.props.groupid;
        const userid = this.props.userid;
        // if a project is a selected, default to that
        const projectid = this.props.projectid ? (
            this.props.projectid
        // if not, select the first item
        ) : (this.props.projects.length > 0 ? (
            this.props.projects[0]._id
        // if no projects found, default to null
        ) : null);
        this.state = {
            user: userid,
            group: groupid,
            project: projectid,
            metadata: {
                vendor: '',
                quantity: 1,
                contacts: [{name: '', email: ''}],
                quoteNum: '',
                shipping: 'Standard',
                note: '',
                extendedCost: 0
            },
            items: [],
            sent: false,
            error: ''
        };
    }
    
    handleChange = e => {
        // name includes target obj, index and target key if needed
        let name = e.target.name.split(' ');
        switch(name[0]) {
            case 'project':
                this.setState({project: e.target.value});
                break;
            case 'contact':
                let _contacts = this.state.metadata.contacts.slice();
                _contacts[name[1]][name[2]] = e.target.value;
                let _metadata = Object.assign({contacts: _contacts}, this.state.metadata);
                this.setState({metadata: _metadata});
                break;
            case 'metadata':
                let key = name[1];
                let metadata = Object.assign({}, this.state.metadata);
                metadata[key] = e.target.value;
                this.setState({metadata});
                break;
            case 'item':
                let items = this.state.items.slice();
                items[name[1]][name[2]] = e.target.value;
                this.getExtendedCost();
                this.setState({items});
                break;
            default:
                break;
        }
    };
    
    handleSubmit = e => {
        e.preventDefault();
        this.setState({sent: true});
        let { sent, error, project, ...form } = this.state;
        if(project) { form.project = project; }
        this.props
            .onSubmit(form)
            .then((res) => {
                console.log('ORDER SUBMIT SUCCESSFUL');
                this.props.loadFocus('new');
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error, sent: false});
                return;
            });
        
    };
    
    addItem = e => {
        if(this.state.items.length < 51) {
            let _items = this.state.items.concat({
                    description: '',
                    itemNum: '',
                    quantity: 1,
                    unitCost: 0.00,
                    shipping: '',
                    cots: false
                });
            this.setState({items: _items});
        }
    }
    
    removeItem = e => {
        if(this.state.items.length > 0) {
            let _items = this.state.items.slice();
            _items.pop();
            this.setState({items: _items});
            if(this.state.items.length === 0) {
                e.target.disabled = true;
            } else { e.target.disabled = false; }
        }
    }
    
    addContact = e => {
        if(this.state.metadata.contacts.length < 6) {
            let { contacts, ...rest } = this.state.metadata;
            let _contacts = contacts.concat({
                name: '',
                email: ''
            });
            this.setState({metadata: {contacts: _contacts, ...rest}});
        }
    }
    
    removeContact = e => {
        if(this.state.metadata.contacts.length > 1) {
            let { contacts, ...rest } = this.state.metadata;
            let _contacts = contacts.slice();
            _contacts.pop();
            this.setState({metadata: {contacts: _contacts, ...rest}});
        }
    }
    
    getExtendedCost = e => {
        let sum = 0;
        this.state.items.forEach(i => {
            sum += i.unitCost * i.quantity;
        });
        sum = (Math.round(sum*100) / 100);
        let _metadata = Object.assign({}, this.state.metadata);
        _metadata.extendedCost = sum;
        this.setState({metadata: _metadata});
    }
    
    checkCots = e => {
        let _items = this.state.items.slice();
        _items[e.target.name].cots ?
            (_items[e.target.name].cots = false):
            (_items[e.target.name].cots = true);
        this.setState({items: _items});
    }
    
    render() {
        const { projects } = this.props;
        // initial value for projects dropdown:
        
        // TODO: add an option to input the TOTAL QUANTITY:
        // const totalQuantInput = false;
        const minDate = (new Date()).toISOString().substring(0,10);
        console.log('minDate:');
        console.log(minDate);
        
        const projectid = this.state.project;
        
        console.log(this.state);
        
        const { sent, error } = this.state;
        const items = this.state.items.slice();
        const contacts = this.state.metadata.contacts.slice();
        const { extendedCost } = this.state.metadata;
        return(
            <div>
                <form onSubmit={this.handleSubmit} className="order-form display floor">
                    <h2>New Order</h2>
                    {error && (
                        <div className="alert-box">{error.message}</div>
                    )}
                    <div className="meta">
                        <h3 className="floor">Metadata:</h3>
                        <div className="section row hat floor">
                            <label htmlFor="project">Project:</label>
                            {projects.length > 0 ? (
                                <div className="styled-select gray">
                                    <select
                                        value={projectid}
                                        name="project"
                                        onChange={this.handleChange}>
                                        <ProjectSelector projects={projects}/>
                                    </select>
                                </div>
                            ) : ( <div><strong>N/A</strong></div> )}
                        </div>
                        
                        <div className="section row hat floor">
                            <label htmlFor="vendor">Vendor:</label>
                            <input
                                id="vendor"
                                name="metadata vendor"
                                onChange={this.handleChange}
                                type="text"
                                placeholder="Vendor"
                            />
                            <label htmlFor="quoteNum">Quote #:</label>
                            <input
                                id="quoteNum"
                                name="metadata quoteNum"
                                onChange={this.handleChange}
                                type="text"
                                placeholder="Quote #"
                            />
                        </div>
                        
                        <div className="contacts">
                            <h3 className="hat floor">Contacts:</h3>
                            <ul>
                                <Contacts contacts={contacts} handleChange={this.handleChange}/>
                            </ul>
                            <div className="section row space-around dbhat floor">
                                <div onClick={this.addContact} className="btn blue"><i className="fas fa-plus"></i></div>
                                <div onClick={this.removeContact} className="btn blue"><i className="fas fa-minus"></i></div>
                            </div>
                        </div>
                    </div>
                    
                    <hr/>
                    <div className="items">
                        <h3>Items:</h3>
                        <ul className="items-list">
                            <Items
                                items={items}
                                handleChange={this.handleChange}
                                checkCots={this.checkCots}
                                minDate={minDate}
                            />
                        </ul>
                        <div className="section row space-around dbhat">
                            <div onClick={this.addItem} className="btn blue start"><i className="fas fa-plus"></i></div>
                            <div disabled={true} onClick={this.removeItem} className="btn blue end"><i className="fas fa-minus"></i></div>
                        </div>
                    </div>
                    <hr/>
                    <div className="extended-cost">Calculated Extended Cost: ${extendedCost}</div>
                    <hr/>
                    <div className="section row hat">
                        <label htmlFor="delivery">Shipping Type:</label>
                        <input
                            id="delivery"
                            name="metadata shipping"
                            onChange={this.handleChange}
                            placeholder="Standard"
                            type="text"
                        />
                    </div>
                    <p className="footnote">(e.g. Standard, 2-day, Overnight, etc.)</p>
                    <div className="section row hat">
                        <label htmlFor="note">Note(s):</label>
                        <input
                            id="note"
                            name="metadata note"
                            onChange={this.handleChange}
                            type="textarea"
                        />
                    </div>
                    <p className="footnote">(e.g. Extra cheese, hold the mayo, etc.)</p>
                    <hr/>
                    <div className="section row center">
                        {sent ? (
                            <div className='medium loading-wheel'>
                                <div id="spinner">
                                    <i className="fas fa-spinner"></i>
                                </div>
                            </div>
                        ) : (
                            <button type="submit" className="btn blue">
                                Submit Order
                            </button>
                        )}
                    </div>
                </form>
            </div>
        );
    }
}

// {totalQuantInput ? (
//     <div>
//         <label htmlFor="quantity">Total Build Quantity:</label>
//         x<input
//             className="form-control"
//             id="quantity"
//             name="metadata quantity"
//             onChange={this.handleChange}
//             type="number"
//             min="1"
//             placeholder="1"
//         />
//         <p>NOT the item quantity - only for special cases.</p>
//     </div>
//     ) : null}