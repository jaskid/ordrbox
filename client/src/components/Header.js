import React from 'react';
import Searchbar from '../components/Searchbar';

const Header = props => {
    const {
        title,
        numMembers,
        parentGroup,
        // alerts,
        isGroup,
        isAdmin,
        isUser,
        isProject,
        selection,
        handleChange,
        onSearch,
        changeFocus,
        searchKey,
        searchValue
    } = props;
    let { inbox } = props;
    if(!inbox) { inbox = 0; }
    return(
        <div className="header section col pad space">
            <div className="section row">
                <h3 id="subject-title" className="hat">{ parentGroup ? (`${parentGroup} / `) : '' }{title}</h3>
                { isAdmin ? (<h6 id="admin-sup">&nbsp;&nbsp;ADMIN</h6>) : null }
            </div>
            
            <div className="section row floor space">
                <div className="info">
                    { numMembers ? (<span><i className="fas fa-users"></i>&ensp;{numMembers}&ensp;|&ensp;</span>) : null }
                    <span><i className="fas fa-inbox"></i>&ensp;{inbox}&ensp;</span>
                    {/* isUser ? (<span>|&ensp;<i className="fas fa-exclamation-triangle"></i>&ensp;{alerts}</span>) : null */}
                </div>
            
                <div className="options section row">
                    <div className="start">
                        <Searchbar
                            handleChange={handleChange}
                            onSearch={onSearch}
                            searchKey={searchKey}
                            searchValue={searchValue}
                            isUser={isUser}
                        />
                    </div>
                </div>
                <div className="focusbar section row">
                    {/*isUser ? (
                        <button
                            name="alerts"
                            className={selection === 'alerts' ? 'tab btn selected' : 'tab btn'}
                            onClick={changeFocus}>
                            <i className="fas fa-bell"></i>
                        </button>
                    ) : null*/}
                    {isAdmin && isGroup ? (
                        <button
                            name="settings"
                            className={selection === 'settings' ? 'tab btn selected' : 'tab btn'}
                            onClick={changeFocus}>
                            <i className="fas fa-cog"></i>
                        </button>
                    ) : null}
                    <button
                        name="feed-new"
                        className={selection === 'feed-new' ? 'tab btn selected' : 'tab btn'}
                        onClick={changeFocus}>
                        <i className="fas fa-clipboard-list"></i>
                    </button>
                    <button
                        name="feed-done"
                        className={selection === 'feed-done' ? 'tab btn selected' : 'tab btn'}
                        onClick={changeFocus}>
                        <i className="fas fa-clipboard-check"></i>
                    </button>
                    {isUser ? (
                        <button
                            name="canceled"
                            className={selection === 'feed-canceled' ? 'tab btn selected' : 'tab btn'}
                            onClick={changeFocus}>
                            <i className="fas fa-ban"></i>
                        </button>
                    ) : null}
                    {isGroup || isProject ? (
                        <button
                            name="newOrder"
                            className={selection === 'newOrder' ? 'tab btn selected' : 'tab btn'}
                            onClick={changeFocus}>
                            <i className="fas fa-file-signature"></i>
                        </button>
                    ) : null}
                </div>
                
            </div>
        </div>
    );
};

export default Header;