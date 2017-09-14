import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import axios from 'axios'
import {browserHistory} from 'react-router'
import {showLoadmask, hideLoadmask} from 'react-redux-loadmask'
import '../node_modules/toastr/build/toastr.css'
import injectTapEventPlugin from 'react-tap-event-plugin';
import '../node_modules/react-select/dist/react-select.css';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__
const store = createStore(initialState)

/**
socket.on('pet.new', function(event) {
  store.dispatch({
    type: 'GOT_NEW_PET',
    payload: event.pet
  })
})
 **/


// ========================================================
// Application Modules Config
// ========================================================
axios.defaults.baseURL = '/api/api'
axios.interceptors.request.use(function(config) {
  // Do something before request is sent
  store.dispatch(showLoadmask())
  return config
}, function(error) {
  // Do something with request error
  store.dispatch(hideLoadmask())
  return Promise.reject(error)
})
axios.interceptors.response.use(function(response) {
  store.dispatch(hideLoadmask())
  return response
}, function(error) {
  store.dispatch(hideLoadmask())
  if (error.response.status === 401) {
    browserHistory.push('/login')
  } else {
    return Promise.reject(error)
  }
})

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('./routes/index').default(store)
  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()
