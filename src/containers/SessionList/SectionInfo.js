import React from 'react'
import Protypes from 'prop-types'
import './SectionInfo.scss'

export const SectionInfo = ({date, time, venue, large}) => (
  <div className={`section-info ${large ? 'large' : ''}`}>
    <div className="date-time">
      <span className="date">{date}</span>
      <span className="time">{time}</span>
    </div>
    <div className="venue">{venue}</div>
  </div>
)

SectionInfo.prototype = {
  date: Protypes.string.isRequired,
  venue: Protypes.string.isRequired,
  time: Protypes.string.isRequired,
}

export default SectionInfo
