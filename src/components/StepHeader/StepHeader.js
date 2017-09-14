import React from 'react'
import PropTypes from 'prop-types'

export const StepHeader = (props) => (
  <div className="ui-step-header">
    <span className="step">{props.step}</span>
    <div className="ui-section-title">{props.title}</div>
  </div>
);

StepHeader.propTypes = {
  step: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};



export default StepHeader;
