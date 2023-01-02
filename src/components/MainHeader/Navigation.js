import React from 'react';

import classes from './Navigation.module.css';

const Navigation = (props) => {
  function SessionLogout (){
    localStorage.setItem('isLoggedIn','0')
    props.onLogout();
  }
  return (
    <nav className={classes.nav}>
      <ul>
        {props.isLoggedIn && (
          <li>
            <a href="/">Users</a>
          </li>
        )}
        {props.isLoggedIn && (
          <li>
            <a href="/">Admin</a>
          </li>
        )}
        {props.isLoggedIn && (
          <li>
            <button onClick={()=>SessionLogout()}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
