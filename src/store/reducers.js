import {combineReducers} from 'redux'
import locationReducer from './location'
import { reducer as uiReducer } from 'redux-ui'
import {loadmaskReducer} from 'react-redux-loadmask'



export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    loadmaskReducer,
    location: locationReducer,
    ui: uiReducer,
    ...asyncReducers
  })
}

// courses: coursesReducer,


export const injectReducer = (store, {key, reducer}) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
