import React, {Component} from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

class Layout  extends Component {

  state = {
    showSideDrawer: false
  }

  SideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false })
  }

  SideDrawerToggleHandler = () => {
    this.setState({showSideDrawer: !this.setState.showSideDrawer})
  }

  render() {
    return (
      <Auxiliary>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          drawerToggleClick={this.SideDrawerToggleHandler} 
        />
        <SideDrawer
          isAuth={this.props.isAuthenticated}
          closed={this.SideDrawerClosedHandler} 
          open={this.state.showSideDrawer}  
        />
        <main className={classes.Content} >
          {this.props.children}
        </main>
      </Auxiliary>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

export default connect(mapStateToProps)(Layout);