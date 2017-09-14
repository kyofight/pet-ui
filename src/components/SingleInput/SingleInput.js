import React from 'react'
import PropTypes from 'prop-types'

const SingleInput = (props) => (
  <div className='ui-form-group'>
    <label htmlFor='name'>{props.title}</label>
    <input
      className='ui-control'
      type={props.inputType}
      value={props.value}
      name={props.name}
      onChange={props.controlFunc}
      disabled={props.disabled}
      placeholder={props.placeholder} />
  </div>
)

SingleInput.propTypes = {
  inputType: PropTypes.oneOf(['text', 'number']).isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
}

export default SingleInput
