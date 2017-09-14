import React from 'react'
import PropTypes from 'prop-types'
import './StatusBar.scss'

export class StatusBar extends React.Component {

  constructor(props) {
    super(props)
    let title = ''
    if (this.props.status === 'complete') {
      title = '所有費用巳經繳交，你可以使用我們的系統及報名'
    } else if (this.props.status === 'incomplete') {
      title = '你還未繳交 ' + this.props.incompletePaymentIds.join()
    }

    this.state = {
      title: title
    }
  }

  render() {
    return (
      <div className={'status-bar ' + this.props.status}>
          <div className="title">{this.state.title}</div>
      </div>
    )
  }
}


// courseList
StatusBar.propTypes = {
  status: PropTypes.oneOf(['complete', 'incomplete']).isRequired,
  incompletePaymentIds: PropTypes.oneOf(['venueFee', 'remainings']).isRequired
}


export default StatusBar
