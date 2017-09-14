import React from 'react'
import PropTypes from 'prop-types'
import './PaymentForm.scss'
import Checkmark from '../../components/Checkmark/index'
import SingleInput from '../../components/SingleInput/index'
import axios from 'axios'

  /**
   * PaymentForm
   * a stateful component to handle:
   * selection choice
   * coupon input and validation
   * calculate total price
   * p.s. accept to pass a selected choice, coupon code for edit version
   *
   * got a handler to tell parent whenever a choice is selected
   */


class PaymentForm extends React.Component {
  constructor(props) {
    super()
    this.state = {
      selectedIds: props.selectedPaymentIds || ['deposit'],
      grandTotal: 0,
      referenceCode: props.referenceCode || '',
      isCouponDirty: false,
      isCouponValid: false,
      discountPercentage: ''
    }
  }



  componentDidMount(props) {
    this.calculateGrandTotal()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.paymentOptions != nextProps.paymentOptions) {
      this.calculateGrandTotal()
    }
  }

  verifyCoupon(e) {

    axios.get('payment/referenceCode/check/' + this.state.referenceCode).then(json => {

      var isValid = json.data.couponIsValid
      if (!isValid) {
        this.setState({
          referenceCode: '',
          isCouponDirty: true
        })
      } else {
        this.setState({
          isCouponValid: json.data.couponIsValid,
          isCouponDirty: true,
          discountPercentage: json.data.discountPercentage
        })
      }
    })
  }

  cancelCoupon() {
    this.setState({
      isCouponValid: false,
      referenceCode: '',
      discountPercentage: '',
      isCouponDirty: false
    })
  }

  onCouponChange(e) {
    this.setState({
      referenceCode: e.target.value
    })
  }

  updateParent() {
    const state = this.state
    const refCode = state.isCouponValid ? state.referenceCode : null
    if(this.props.onSelect !== null) {
      this.props.onSelect(state.selectedIds, state.grandTotal, refCode)
    }
  }

  calculateGrandTotal() {
    if (this.state.isCouponValid) {
      this.updateGrandTotalByApi()
    } else {
      this.updateGrandTotalByFrontend()
    }
  }

  updateGrandTotalByApi() {
    console.log('updateGrandTotalByApi');
    axios.post('course/price', {
      courseId: this.props.courseId,
      referenceCode: this.state.referenceCode,
      paymentStages: this.state.selectedIds
    }).then(res => res.data).then(json => {
      console.log(json.totalPrice)
      this.setState({
        grandTotal: json.totalPrice
      }, this.updateParent)
    })
  }

  updateGrandTotalByFrontend() {
    this.setState((state, props) => {
      return {
        grandTotal: props.paymentOptions.filter(option => state.selectedIds.indexOf(option.id) > -1 )
          .filter(option => !option.paid)
          .map(option => option.price)
          .reduce((sum, price) => {
            console.log(sum, price)
            return sum += price
          }, 0)
      }
    }, this.updateParent)
  }

  onSelectChange(id) {

    this.setState((prevState) => {

      let update = prevState.selectedIds

      if (update.indexOf(id) === -1) {
        update.push(id)
      } else {
        update.splice(update.indexOf(id),1)
      }
      return {
        selectedIds: update
      }
    }, this.calculateGrandTotal)
  }

  render() {
    const paymentOptions = this.props.paymentOptions
    const selectedPayments = this.state.selectedIds
    const grandTotal = this.state.grandTotal

    let couponButton = !this.state.isCouponValid ?
      <button onClick={this.verifyCoupon.bind(this)}>Verify</button> :
      <button onClick={this.cancelCoupon.bind(this)}>Cancel</button>

    const referenceCodeInput = <div>
      <SingleInput
        inputType='text'
        title='輸入優惠碼(如有)'
        name='referenceCode'
        controlFunc={this.onCouponChange.bind(this)}
        value={this.state.referenceCode}
        disabled={this.state.isCouponValid} />
      {
        !this.state.isCouponValid && this.state.isCouponDirty &&
        <p>Your reference code is not valid</p>
      }
      {
        this.state.isCouponValid &&
        <p>discount percentage: {this.state.discountPercentage}</p>
      }
      {couponButton}
    </div>

    const referenceCodeDisplay = !this.props.referenceCode ?
      <div>you did not used any reference code</div> :
      <div>You have used reference code: {this.props.referenceCode}</div>

    const referenceCode = (this.props.selectedPaymentIds) ?
      referenceCodeDisplay :
      referenceCodeInput




    return <div className="payment-form">
      {paymentOptions.map((payment) => (
        <div key={payment.id} className={`checkbox-row ${selectedPayments.indexOf(payment.id) > -1 ? 'checked' : ''}`}>
          <div className='left' onClick={this.onSelectChange.bind(this, payment.id)}>
            {
              !payment.paid && <Checkmark checked={selectedPayments.indexOf(payment.id) > -1} />
            }
          </div>
          <div className='right'>
            <div className='price-row'>
              <div className='left'>
                <div className='ui-widget-title'>{payment.title}</div>
                <div className='ui-info'>{payment.description}</div>
              </div>
              <div className='right'>
                <div className='price'>¥ {payment.price}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className='discount-row'>
        {referenceCode}
      </div>

      <div className='total-row'>
        <div className='total-price'>
          <div className='label'>總共</div>
          <div className='the-price'>¥ {grandTotal}</div>
          <div className='underline' />
        </div>
      </div>
    </div>
  }
}

PaymentForm.PropTypes = {
  courseId: PropTypes.string.isRequired, // required to call API
  onSelect: PropTypes.func.isRequired,
  paymentOptions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    paid: PropTypes.bool
  })).isRequired,
  selectedPaymentIds: PropTypes.arrayOf(PropTypes.string), // edit mode
  referenceCode: PropTypes.string, // edit mode
};

PaymentForm.DefaultProps = {
  selectedPayments: []
}

export default PaymentForm

