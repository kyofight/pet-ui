import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {registerSession, continuePayment, tradeCourse} from '../../store/registeredCoursesReducer'
import RegisteredCourseList from './RegisteredCourseList'
import getComposedRegisteredList from './selector'

const mapStateToProps = state => {
  return {
    courses: getComposedRegisteredList(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      registerSession,
      continuePayment,
      tradeCourse
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisteredCourseList)
