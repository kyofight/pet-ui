import {injectReducer} from '../../store/reducers'

export default (store) => ({
  path : 'pets',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const petsContainer = require('./containers/petsContainer').default
      const petsReducer = require('./modules/petsReducer').default
      injectReducer(store, {
        key: 'pets',
        reducer: petsReducer
      })

      cb(null, petsContainer)
    }, 'pets')
  }
})
