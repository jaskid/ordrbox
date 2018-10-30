/* global localStorage */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import { BrowserRouter as Router } from 'react-router-dom';
import { setAuthorizationToken, setCurrentUser } from '../store/actions/auth';
import jwtDecode from 'jwt-decode';

// COMPONENTS
import Navbar from './Navbar';
import Main from './Main';

const store = configureStore();

// (RE)HYDRATION - if the server goes down, the page refreshes, or the store is cleared -
// the token is preserved, and we can repopulate/rehydrate our state with the
// current user.
if(localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  // prevent manual tampering with the key of jwtToken in localStorage
  try {
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
  } catch(e) {
    store.dispatch(setCurrentUser({}));
  }
}

const App = props => (
    <Provider store={store}>
      <Router>
        <div className='onboarding'>
          <Navbar/>
          <Main/>
        </div>
      </Router>
    </Provider>
);

export default App;