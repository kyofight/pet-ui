import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import './Header.scss'
import Logo from '../../images/pet-logo.jpg'

@connect(mapStateToProps)
class Header extends React.Component {
  render() {
    return (
      <div className='header-menu'>
        <div className='con'>
          <a className='logo'>
            <img src={Logo} />
          </a>
          <div className='nav-wrap'>
            <div className='item'>
              <Link to='/customers' activeClassName='route--active'>
                Customers
              </Link>
            </div>
            <div className='item'>
              <Link to='/pets' activeClassName='route--active'>
                Pets
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default Header
