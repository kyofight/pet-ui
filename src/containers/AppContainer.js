import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {browserHistory, Router, applyRouterMiddleware} from 'react-router'
import {Provider} from 'react-redux'
import {useScroll} from 'react-router-scroll'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const {routes, store} = this.props

    return (
      <MuiThemeProvider>
      <Provider store={store}>
        <div style={{height: '100%'}}>
          <Router history={browserHistory} children={routes} render={applyRouterMiddleware(useScroll())} />
        </div>
      </Provider>
      </MuiThemeProvider>
    )
  }
}

export default AppContainer
