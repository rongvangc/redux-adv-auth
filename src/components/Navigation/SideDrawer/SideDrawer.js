import React from 'react'

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const SideDrawer = (props) => {
  // ...
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Auxiliary>
      <Backdrop show={props.open} clicked={props.closed} /> {/* Add Show nó sẽ tự đông set show = true */}
        <div className={attachedClasses.join(' ')}>
          <div className={classes.Logo}>
            <Logo />
          </div>
          <nav>
            <NavigationItems isAuthenticated={props.isAuth} />
          </nav>
        </div>
    </Auxiliary>
  );
}

export default SideDrawer