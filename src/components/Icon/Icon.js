import React from 'react'
import PropTypes from 'prop-types'
import './Icon.scss'
import Icons from '../../assets/sprite/index.svg';

const Icon = ({ name, color, size }) => (
  <svg className={`icon icon-${name}`} fill={color} width={size} height={size}>
    <use xlinkHref={`#icon-${name}`} />
  </svg>
);

Icon.PropTypes = {
  name: React.PropTypes.string.isRequired,
  color: React.PropTypes.string,
  size: React.PropTypes.number
};

export default Icon
