import {injectReducer} from '../../store/reducers'

export default (store) => ({
  path : 'customers',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const customersContainer = require('./containers/customersContainer').default
      const customersReducer = require('./modules/customersReducer').default
      injectReducer(store, {
        key: 'customers',
        reducer: customersReducer
      })

      cb(null, customersContainer)
    }, 'customers')
  }
})
