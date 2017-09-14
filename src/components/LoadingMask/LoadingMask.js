import React from 'react'
import Loadmask from 'react-redux-loadmask'
import Loading from 'react-loading'

const LoadingMask = () => {
  return (
    <Loadmask bgColor='rgba(0, 0, 0, 0.5)'>
      <Loading delay={0} type='spinningBubbles' color='rgba(0,0,255,0.3)' height='100px' width='100px' />
    </Loadmask>
  )
}

export default LoadingMask
