import React from 'react';

const Searchbar = ({ handleChange, onSearch, searchKey, searchValue, isUser }) => {
    const handleKeyPress = e => {
        // onSearch();
        if (e.key === 'Enter') {
          onSearch(e.target.value);
        }
    };
    return(
        <div className="section row search">
            <label htmlFor="key">SORT</label>
            <div className="styled-select">
                <select name="searchKey" onChange={handleChange} value={searchKey}>
                    <option value="vendor">Vendor</option>
                    {!isUser ? (<option value="user">Requester</option>) : null}
                    <option value="quoteNum">Quote Number</option>
                </select>
            </div>
            <div className="searchbar">
                <i className="fas fa-search icon"></i>
                <input
                    type="text"
                    name="searchValue"
                    onChange={handleChange}
                    value={searchValue}
                    placeholder="Search"
                    onKeyPress={handleKeyPress}
                />
            </div>
            {/*<button className="btn" onClick={onSearch}>Search</button>*/}
        </div>
    );
};

export default Searchbar;