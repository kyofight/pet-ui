import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment';
import Select from 'react-select';
import './CustomersPage.scss'

// todo: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ make select, input, table.... a component t o reuse ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export class CustomersPage extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.props.getCustomerList()
	}

	handleChange(field, e) {
		this.props.handleInputChange({field, value: e.target.value})
	}

	createCustomer() {
		this.props.createCustomer()
	}

	handleSelectChange(type, value) {
		console.log('You\'ve selected:', value, 'type', type);
		this.props.preferenceSelectChange({value, type})
	}

	render() {
		const props = this.props

		return (
			<div className='ui-page-gutter'>
				<div className='ui-container'>
					<h2 className='ui-hero-title'>
						Customers Available
					</h2>

					<table className="table text-left form-inline">
						<thead>
						<tr>
							<th>Username</th>
							<th>Preference</th>
							<th className="text-center">Create Date</th>
						</tr>
						</thead>
						<tbody>
						<tr>
							<td>
								<input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0" id="username"
								       onChange={this.handleChange.bind(this, 'username')}
								       placeholder="Username"/>
							</td>
							<td>
								<table className="table preference-table text-left">
									<tbody>
									<tr>
										<td>
											<input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0 age-input" id="ageFrom"
											       onChange={this.handleChange.bind(this, 'preference.ageFrom')}
											       placeholder="Age From"/>
											<span className="to">-</span>
											<input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0 age-input" id="ageTo"
											       onChange={this.handleChange.bind(this, 'preference.ageTo')}
											       placeholder="Age To"/>
										</td>
									</tr>
									<tr>
										<td><Select
											name="form-field-name"
											options={[{value: 'cat', label: 'cat'}, {value: 'dog', label: 'dog'}, {
												value: 'rabbit',
												label: 'rabbit'
											}]}
											multi
											closeOnSelect={false}
											onChange={this.handleSelectChange.bind(this, 'species')}
											placeholder="Select species"
											value={props.customer.preference.species}
										/></td>
									</tr>
									<tr>
										<td>
											<Select
												name="form-field-name"
												options={[{value: 'labrador', label: 'labrador'}, {
													value: 'poodle',
													label: 'poodle'
												}, {value: 'spaniel', label: 'spaniel'}, {value: 'terrier', label: 'terrier'}]}
												multi
												closeOnSelect={false}
												onChange={this.handleSelectChange.bind(this, 'breed')}
												placeholder="Select breed"
												value={props.customer.preference.breed}
											/></td>
									</tr>
									</tbody>
								</table>
							</td>
							<td className="text-center">
								<button className="form-control" onClick={() => this.createCustomer()}>Create</button>
							</td>
						</tr>
						{
							props.customerList.map(customer => (
								<tr key={customer.id}>
									<td>
										{customer.username}
									</td>
									<td>
										<table className="table text-left preference-table">
											<tbody>
											<tr>
												<td>{customer.preference.ageFrom} - {customer.preference.ageTo}</td>
											</tr>
											<tr>
												<td>{customer.preference.species.join(', ')}</td>
											</tr>
											<tr>
												<td>{customer.preference.breed.join(', ')}</td>
											</tr>
											</tbody>
										</table>
									</td>
									<td className="text-center">
										{moment(customer.createDate).format('YYYY-MM-DD , h:mm:ss a')}
									</td>
								</tr>
							))
						}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}


CustomersPage.propTypes = {
	customerList: PropTypes.array.isRequired,
	getCustomerList: PropTypes.func.isRequired,
}

export default CustomersPage
