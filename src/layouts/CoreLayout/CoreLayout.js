import React from 'react'
import PropTypes from 'prop-types'
import Header from '../../components/Header'
import LoadingMask from '../../components/LoadingMask'

export class CoreLayout extends React.Component {
  render() {
    const {children, location} = this.props
    let header = null
    // TODO: refactor to be controlled in page route config
    if (!['/login', '/register'].includes(location.pathname)) {
      header = <Header />
    }
    return (
      <div className='container text-center'>
        <LoadingMask />
        {header}
        <div className='core-layout'>
          {children}
        </div>
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children : PropTypes.element.isRequired,
  location: PropTypes.object
}

export default CoreLayout
