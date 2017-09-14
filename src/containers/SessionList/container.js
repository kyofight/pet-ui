import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {registerSession} from '../../store/registeredCoursesReducer'
import {selectIsAllowRegister, composeSessionListWithSelectedSession} from './selector'
import SessionList from './SessionList'

const mapStateToProps = (state, props) => {
  // console.log('tree update, update component..', props)
  return {
    allowRegister: !!selectIsAllowRegister(state, props),
    sessionList: composeSessionListWithSelectedSession(state, props)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      registerSession
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionList)

