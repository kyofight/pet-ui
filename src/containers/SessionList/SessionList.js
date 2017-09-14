import React from 'react'
import PropTypes from 'prop-types'
import Checkmark from '../../components/Checkmark'
import Availability from '../../components/Availability'
import SectionInfo from './SectionInfo'
import './SessionList.scss'

/**
 * this component get the session list by the given subject ID
 * each session display the date, time, venue, availability
 * if can_register is true
 * it will also show the selected registered session (if any),
 * and allow registration
 *
 *
 * getSessionsList
 * registerSessions
 */


export class SessionList extends React.Component {

  constructor(props) {
    super(props)
    // this.registerSession = this.registerSession.bind(this)
  }

  render() {
    const sessionList = this.props.sessionList
    return <div className="session-list">
      {
        sessionList.map(session => (
          <div className="session-row" key={session.id}>
            {this.props.allowRegister &&
            <div onClick={this.props.actions.registerSession.bind(this, this.props.registrationId, session.id)}>
              <Checkmark checked={session.isSelected}/>
            </div> }
            <SectionInfo
              venue={session.venue}
              date={new Date(session.classDate * 1000).toDateString()} />
            <Availability count={session.registrationCount} total={session.capacity}/>
          </div>
        ))
      }
    </div>
  }
}


SessionList.propTypes = {
  subjectId: PropTypes.string.isRequired,   // get the session based on this ID
  selectedSessionId: PropTypes.string, // deprecated
  sessionList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    venue: PropTypes.string.isRequired,
    classDate: PropTypes.number.isRequired,
    capacity: PropTypes.number,
    registrationCount: PropTypes.number
  })),
  allowRegister: PropTypes.bool, // show checkbox and allow register if true // deprecated
  registrationId: PropTypes.string // supply this argument in to get and reselect session-registration
}


SessionList.defaultProps = {
  sessionList: [],
  allowRegister: false,
  subjectId: 'subject_1'
}


export default SessionList
