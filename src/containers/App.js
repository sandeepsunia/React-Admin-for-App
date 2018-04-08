import React from 'react';
import {
    Navbar,
    NavLink
} from 'react-materialize';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logoutAndRedirect } from '../actions';

import '../styles/core.scss';

@connect((state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
})

export default class CoreLayout extends React.Component {
    render() {
      const { dispatch } = this.props;
      return (
          <div>
              <Navbar brand='Admin Panel' right>
                
                {/* to be removed */}
                <li><Link to="/initialize">*Initialize</Link></li>
                {/* ------------- */}


                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/conferences">Conference</Link></li>
                <li><Link to="/tracks">Tracks</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/users">Users</Link></li>


                {this.props.isAuthenticated
                    ? <li><a href='#' onClick={() => this.props.dispatch(logoutAndRedirect())}>Logout</a> </li>
                    : <li><Link to="/login">Login</Link></li>
                }
              </Navbar>
              
              <div className='container'>
                  <div className='row'>
                      <div className='col s12 m12 l12'>
                          {this.props.children}
                      </div>
                  </div>
              </div>
          </div>

      );
    }
}
