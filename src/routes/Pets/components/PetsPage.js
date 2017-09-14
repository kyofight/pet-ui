import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment';
import Select from 'react-select';
import './PetsPage.scss'

// todo: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ make select, input, table.... a component t o reuse ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export class PetsPage extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.props.getPetList()
	}

	handleChange(field, e) {
		this.props.handleInputChange({field, value: e.target.value})
	}

	createPet() {
		this.props.createPet()
	}

	handleSelectChange(type, value) {
		console.log('You\'ve selected:', value, 'type', type);
		this.props.attributesSelectChange({value, type})
	}

	render() {
		const props = this.props

		return (
			<div className='ui-page-gutter'>
				<div className='ui-container'>
					<h2 className='ui-hero-title'>
						Pets Available
					</h2>

					<table className="table text-left form-inline">
						<thead>
						<tr>
							<th>Name</th>
							<th>Attributes</th>
							<th className="text-center">Create Date</th>
						</tr>
						</thead>
						<tbody>
						<tr>
							<td>
								<input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0" id="username"
								       onChange={this.handleChange.bind(this, 'name')}
								       placeholder="Name"/>
							</td>
							<td>
								<table className="table attributes-table text-left">
									<tbody>
									<tr>
										<td>
											<input type="text" className="form-control" id="ageFrom"
											       onChange={this.handleChange.bind(this, 'attributes.age')}
											       placeholder="Age"/>
										</td>
									</tr>
									<tr>
										<td><Select
											name="form-field-name"
											options={[{value: 'cat', label: 'cat'}, {value: 'dog', label: 'dog'}, {
												value: 'rabbit',
												label: 'rabbit'
											}]}
											onChange={this.handleSelectChange.bind(this, 'specie')}
											placeholder="Select specie"
											simpleValue
											value={props.pet.attributes.specie}
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
												onChange={this.handleSelectChange.bind(this, 'breed')}
												placeholder="Select breed"
												simpleValue
												value={props.pet.attributes.breed}
											/></td>
									</tr>
									</tbody>
								</table>
							</td>
							<td className="text-center">
								<button className="form-control" onClick={() => this.createPet()}>Create</button>
							</td>
						</tr>
						{
							props.petList.map(pet => (
								<tr key={pet.id}>
									<td>
										{pet.name}
									</td>
									<td>
										<table className="table text-left attributes-table">
											<tbody>
											<tr>
												<td>{pet.attributes.age}</td>
											</tr>
											<tr>
												<td>{pet.attributes.specie}</td>
											</tr>
											<tr>
												<td>{pet.attributes.breed}</td>
											</tr>
											</tbody>
										</table>
									</td>
									<td className="text-center">
										{moment(pet.createDate).format('YYYY-MM-DD , h:mm:ss a')}
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


PetsPage.propTypes = {
	petList: PropTypes.array.isRequired,
	getPetList: PropTypes.func.isRequired,
}

export default PetsPage
