import {connect} from 'react-redux'
import * as actions from '../modules/petsReducer'
import PetsPage from '../components/PetsPage'

const mapDispatchToProps = {
  ...actions
}


const mapStateToProps = state => ({
  petList: state.pets.petList,
  pet: state.pets.pet,
})

export default connect(mapStateToProps, mapDispatchToProps)(PetsPage)
