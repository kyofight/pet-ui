import {connect} from 'react-redux'
import * as actions from '../modules/customersReducer'
import CustomersPage from '../components/CustomersPage'

const mapDispatchToProps = {
  ...actions
}


const mapStateToProps = state => ({
  customerList: state.customers.customerList,
  customer: state.customers.customer,
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomersPage)
