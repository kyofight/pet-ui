import React from 'react'
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import SessionList from '../../containers/SessionList'
import PaymentForm from '../../containers/PaymentForm'
import SingleInput from '../../components/SingleInput'
import RaisedButton from 'material-ui/RaisedButton';
import './RegisteredCourseList.scss'
import StatusBar from './StatusBar'

/**
 * this component get all the registered course
 * each of them has basic course info (title, des),
 * also with the payment status
 *
 * the user can pay the remaining payment
 * or they can trade the course here
 */


export class RegisteredCourseList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedCourse: {},
      selectedPayments: [],
      tradeToMobileNumber: '',
      paymentModalVisible: false,
      tradeModalVisible: false,
    }
  }

  onOpenModal(action, {title, tradingCode, studentLevel, id, paymentStages, selectedPaymentIds, referenceCode}) {
    console.log('paymentStages', paymentStages)
    this.setState({
      selectedCourse: { title, tradingCode, studentLevel, id, referenceCode,
        selectedPaymentIds: selectedPaymentIds,
        paymentStages: paymentStages
      },
      tradeModalVisible: action === 'trade',
      paymentModalVisible: action === 'payment'
    })
  }

  onCloseModal() {
    this.setState({
      selectedCourse: {},
      selectedPayments: [],
      tradeToMobileNumber: '',
      paymentModalVisible: false,
      tradeModalVisible: false,
    })
  }

  onTradeMobileNumberChange(e) {
    this.setState({
      tradeToMobileNumber: e.target.value
    })
  }

  onPaymentSelected(selectedPayments) {
    this.setState({
      selectedPayments
    })
  }


  render() {
    const courses = this.props.courses || []

    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.onCloseModal.bind(this)}
      />,
      <FlatButton
        label="Comform"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.props.actions.tradeCourse.bind(this, this.state.tradeToMobileNumber, this.state.selectedCourse.studentLevel, this.state.selectedCourse.tradingCode)}
      />,
    ];


    return <div className="">

      <Dialog
        actions={actions}
        open={this.state.tradeModalVisible}
        onRequestClose={this.onCloseModal.bind(this)}>
        Trade course
        <h2>{this.state.selectedCourse.title}</h2>

        <SingleInput
          inputType='number'
          title='Mobile number of the receiver'
          name='trade_to_mobile_number'
          controlFunc={this.onTradeMobileNumberChange.bind(this)}
          value={this.state.tradeToMobileNumber}
          placeholder="Trade to mobile number"
        />
      </Dialog>

      <Dialog
        actions={actions}
        open={this.state.paymentModalVisible}
        onRequestClose={this.onCloseModal.bind(this)}>
        <PaymentForm
          courseId={this.state.selectedCourse.courseId}
          onSelect={this.onPaymentSelected.bind(this)}
          paymentOptions={this.state.selectedCourse.paymentStages}
          selectedPaymentIds={this.state.selectedCourse.selectedPaymentIds }
          referenceCode={this.state.selectedCourse.referenceCode}/>
      </Dialog>


      <div className="ui-row">
      {
        courses.map((course)=>(
          <div className="ui-col-2" key={course.id}>
            <Card>
              <CardTitle
                title={course.title}
                subtitle={course.description} />
              <StatusBar
                status={course.incompletePaymentIds.length === 0 ? 'complete' : 'incomplete'}
                incompletePaymentIds={course.incompletePaymentIds}
              />

              <List>
                {
                  course.subjects && course.subjects.map((subject) => (
                    <div>
                      <ListItem
                        key={subject.id}
                        primaryText={subject.topic}
                        secondaryText={subject.selectedSession && subject.selectedSession.classDate || subject.description}
                        primaryTogglesNestedList={true}
                        nestedListStyle={{marginLeft: '-20px'}}
                        nestedItems={[
                          <ListItem disabled={true}>
                            <SessionList
                              registrationId={course.registrationId}
                              subjectId={subject.id}/>
                          </ListItem>
                        ]} />

                    </div>
                  ))
                }
              </List>


              <CardActions>
                {
                  course.incompletePaymentIds.length > 0 &&
                  <RaisedButton label="繳付餘額" primary={true} onTouchTap={this.onOpenModal.bind(this, 'payment', course)}/>
                }
                <FlatButton label="轉移" primary={true} onTouchTap={this.onOpenModal.bind(this, 'trade', course)}/>
              </CardActions>
            </Card>
          </div>
        ))
      }
      </div>
    </div>
  }
}


// courseList
RegisteredCourseList.propTypes = {
  courseList: PropTypes.arrayOf(PropTypes.shape({
    registrationId: PropTypes.string.isRequired,
    tradable: PropTypes.bool.isRequired,
    tradingCode: PropTypes.string.isRequired,
    couponCode: PropTypes.string,
    paymentStages: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired
    })),
    paymentSelected: PropTypes.arrayOf(PropTypes.oneOf('venueFee', 'deposit', 'remainings')),
    incompletePaymentIds: PropTypes.arrayOf(PropTypes.oneOf('venueFee', 'deposit', 'remainings'))
  })),
}

RegisteredCourseList.defaultProps = {
  courses: []
}

export default RegisteredCourseList
