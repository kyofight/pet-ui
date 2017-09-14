import axios from 'axios'
import _ from 'lodash'
import dotProp from 'dot-prop-immutable';
// ------------------------------------
// Constants
// ------------------------------------
export const GOT_CUSTOMER_LIST = 'GOT_CUSTOMER_LIST'
export const HANDLE_INPUT_CHANGE = 'HANDLE_INPUT_CHANGE'
export const CHANGE_SELECT_PREFERENCE = 'CHANGE_SELECT_PREFERENCE'
export const SUCCESS_CREATE_CUSTOMER = 'SUCCESS_CREATE_CUSTOMER'
// ------------------------------------
// Actions
// ------------------------------------

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getCustomerList = () => {
  return (dispatch, getState) => {
    return axios.get('/customers').then((response) => {
      return response.data
    }).then(json => {
      dispatch({
        type    : GOT_CUSTOMER_LIST,
        // todo: should sort by backend and pagination
        payload : _.reverse(json.data, 'createDate')
      })
    }).catch((err) => {
      console.log('parsing failed', err)
      alert('get customer list error: ' + err.response.data.error.message);
      // todo: dispatch error action
    })
  }
}

export const createCustomer = () => {
  return (dispatch, getState) => {
    console.log('getState().customer', getState().customers.customer);
    return axios.post('/customers', getState().customers.customer).then((response) => {
      return response.data
    }).then(json => {
      dispatch({
        type    : SUCCESS_CREATE_CUSTOMER,
        payload : json.data
      })
    }).catch((err) => {
      console.log('parsing failed', err)
      alert('create customer error: ' + err.response.data.error.message);
      // todo: dispatch error action
    })
  }
}

export const handleInputChange = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type    : HANDLE_INPUT_CHANGE,
      payload
    })
  }
}

export const preferenceSelectChange = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type    : CHANGE_SELECT_PREFERENCE,
      payload
    })
  }
}

export const actions = {
  getCustomerList,
  preferenceSelectChange,
  createCustomer,
  handleInputChange,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GOT_CUSTOMER_LIST]: (state, action) => {
    return {
      ...state,
      customerList: action.payload
    }
  },
  [CHANGE_SELECT_PREFERENCE]: (state, action) => {
    return dotProp.set(state, `customer.preference.${action.payload.type}`, _.map(action.payload.value, 'value'));
  },
  [SUCCESS_CREATE_CUSTOMER]: (state, action) => {
    return  dotProp.set(state, 'customerList', list => [action.payload, ...list]);
  },
  [HANDLE_INPUT_CHANGE]: (state, action) => {
    return dotProp.set(state, `customer.${action.payload.field}`, action.payload.value);
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const defaultState = {
  customerList: [],
  customer: {
    username: '',
    preference: {
      ageFrom: '',
      ageTo: '',
      species: [],
      breed: []
    }
  },
}
export default function customersReducer(state = defaultState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
