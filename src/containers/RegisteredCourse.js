import React from 'react'
import {connect} from 'react-redux'
import { createSelector } from 'reselect'
import {bindActionCreators} from 'redux'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import {getCourseList, getRegisteredCourseList, getSessionList} from '../actions/api'
import Dialog from 'material-ui/Dialog';
import PaymentOptionsForm2 from '../components/PaymentOptionsForm'


export const getMyData = () => {
  return dispatch => {
    Promise.all([
      dispatch(getCourseList()),
      dispatch(getRegisteredCourseList()),
      dispatch(getSessionList())
    ])
  }
}

export const StatusInfo = ({title, info}) => (
  <div className="status-info">
    <div className="icon-row">

    </div>
    <div className="content">
      <div className="title">{title}</div>
      <div className="info">
        {info}
      </div>
    </div>
  </div>
)


export class RegisteredCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openedPayModalId: null
    }
  }
  componentDidMount() {
    this.props.actions.getMyData()
  }
  openPayRemainsModal(id) {
    console.log('openPayRemainsModal', id)
    this.setState(() => {
      return {
        openedPayModalId: id
      }
    })
  }
  closePayRemainsModal() {
    this.setState(() => {
      return {
        openedPayModalId: null
      }
    })
  }
  render() {
    const courses = this.props.courses

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closePayRemainsModal.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closePayRemainsModal.bind(this)}
      />,
    ];


    return <div className="ui-row">
      {
        this.props.courses.map((course)=>(
          <div className="ui-col-2" key={course.id}>
            <Card>
              <CardTitle
                title={course.title}
                subtitle={course.description} />
              <StatusInfo
                title={course.paymentStatusInfo && course.paymentStatusInfo.title}
                info={course.paymentStatusInfo && course.paymentStatusInfo.info}
              />

              <List>
                {
                  course.subjects && course.subjects.map((subject) => (
                    <ListItem
                      key={subject.id}
                      primaryText={subject.topic}
                      secondaryText={subject.selectedSession && subject.selectedSession.classDate || subject.description}
                      primaryTogglesNestedList={true}
                      nestedItems={
                        subject.sessions.map(session => (
                          <ListItem
                            key={session.id}
                            nestedItems={}
                            primaryText={session.venue} />
                        ))}
                    />
                  ))
                }
              </List>
              <Dialog
                title="Pay Remains"
                actions={actions}
                modal={false}
                open={this.state.openedPayModalId == course.id}
                onRequestClose={this.closePayRemainsModal.bind(this)}
              >
                <PaymentOptionsForm2
                  courseId={course.id}
                  paymentOptions={course.paymentOptions}
                  selectedPaymentIds={course.paymentStages} />
              </Dialog>

              <CardActions>
                <FlatButton label="Pay remains" onTouchTap={this.openPayRemainsModal.bind(this, course.id)}/>
                <FlatButton label="Transfer" />
              </CardActions>
            </Card>
          </div>
        ))
      }
    </div>
  }
}

RegisteredCourse.defaultProps = {
  courses: []
}


const getRegisteredCourses = (state) => state.courses.registeredCourses
const getFullCourseList = (state) => state.courses.allCourses
const selectSectionList = (state) => state.courses.sectionList

export const getComposedRegisteredList = createSelector([
  getRegisteredCourses,
  getFullCourseList,
  selectSectionList
], (registered, full, sectionList) => {
  if (registered.length == 0 || full.length == 0 || sectionList.length == 0) return

  // merge the details
  let courses = registered.map(reg => {
    let courseDetails = full.find(c => {
      return c.id === reg.courseId
    }) || {}

    let paymentStatusInfo;
    if(courseDetails && courseDetails.paymentStages) {
      const selectedOptions = reg.paymentStages;
      const allOptions = courseDetails.paymentStages;
      const remainingOptions = allOptions.filter((option) => {
        return selectedOptions.indexOf(option.id) == -1
      })
      if (remainingOptions.length > 0) {

        paymentStatusInfo = {
          title: '未付全數',
          info: '你仲未俾 ' + remainingOptions.map((option) => (
            option.title
          )).join()
        }
      } else {
        paymentStatusInfo = {
          title: '全數OK',
          info: 'good job'
        }
      }
    }

    return Object.assign({}, reg, {
      title: courseDetails.title,
      description: courseDetails.description,
      subjects: courseDetails.subjects,
      paymentOptions: courseDetails.paymentStages,
      paymentStatusInfo
    })
  })

  let courses2 = courses.map((course) => {

    let _course = course


    // add the section list to each of the subject
    if(course.subjects) {
      let _subjects = course.subjects.map((subject) => {
        let _sessions = sectionList.filter(section => (section.subjectId === subject.id))
        return Object.assign({}, subject, {
          sessions: _sessions
        })
      })


      // add the selected session for each of the subject
      if (course.registeredClassSessions) {
        // console.log('registeredClassSessions')
        _subjects = _subjects.map((subject) => {
          const registeredSubjectIds = course.registeredClassSessions.map(o => (o.subjectId))
          // console.log('registeredSubjectIds', registeredSubjectIds, 'subjectID: ', subject.id)
          let selectedSession = null;
          if (registeredSubjectIds.indexOf(subject.id) > -1) {
            console.log('bingo')
            selectedSession = course.registeredClassSessions.find(session => (session.subjectId === subject.id))
            console.log('selectedSession: ', selectedSession)
          }
          return Object.assign({}, subject, {
            selectedSession: selectedSession
          })
        })

        // console.log(_subjects)
      }

      // _course.subjects = _subjects

      _course = Object.assign({}, _course, {
        subjects: _subjects
      })

    }

    return _course
  })
  return courses2
})




const mapStateToProps = state => Object.assign({}, {
  courses: getComposedRegisteredList(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({getMyData}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisteredCourse)
