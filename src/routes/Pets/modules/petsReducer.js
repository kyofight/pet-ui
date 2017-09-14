import axios from 'axios'
import _ from 'lodash'
import dotProp from 'dot-prop-immutable';
// ------------------------------------
// Constants
// ------------------------------------
export const GOT_PET_LIST = 'GOT_PET_LIST'
export const HANDLE_INPUT_CHANGE = 'HANDLE_INPUT_CHANGE'
export const CHANGE_SELECT_ATTRIBUTES = 'CHANGE_SELECT_ATTRIBUTES'
export const SUCCESS_CREATE_PET = 'SUCCESS_CREATE_PET'
export const GOT_NEW_PET = 'GOT_NEW_PET'
// ------------------------------------
// Actions
// ------------------------------------

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getPetList = () => {
  return (dispatch, getState) => {
    return axios.get('/pets').then((response) => {
      return response.data
    }).then(json => {
      dispatch({
        type    : GOT_PET_LIST,
        // todo: should sort by backend and pagination
        payload : _.reverse(json.data, 'createDate')
      })
    }).catch((err) => {
      console.log('parsing failed', err)
      alert('get pet list error: ' + err.response.data.error.message);
      // todo: dispatch error action
    })
  }
}

export const createPet = () => {
  return (dispatch, getState) => {
    console.log('getState().pet', getState().pets.pet);
    const pet = getState().pets.pet;
    if (!pet.attributes.breed) {
      delete pet.attributes.breed
    }
    return axios.post('/pets', getState().pets.pet).then((response) => {
      return response.data
    }).then(json => {
      dispatch({
        type    : SUCCESS_CREATE_PET,
        payload : json.data
      })
    }).catch((err) => {
      console.log('parsing failed', err)
      alert('create pet error: ' + err.response.data.error.message);
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

export const attributesSelectChange = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type    : CHANGE_SELECT_ATTRIBUTES,
      payload
    })
  }
}

export const actions = {
  getPetList,
  attributesSelectChange,
  createPet,
  handleInputChange,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GOT_PET_LIST]: (state, action) => {
    return {
      ...state,
      petList: action.payload
    }
  },
  [CHANGE_SELECT_ATTRIBUTES]: (state, action) => {
    return dotProp.set(state, `pet.attributes.${action.payload.type}`, action.payload.value);
  },
  [SUCCESS_CREATE_PET]: (state, action) => {
    return dotProp.set(state, 'petList', list => [action.payload, ...list]);
  },
  [HANDLE_INPUT_CHANGE]: (state, action) => {
    return dotProp.set(state, `pet.${action.payload.field}`, action.payload.value);
  },
  [GOT_NEW_PET]: (state, action) => {
    return dotProp.set(state, 'petList', list => [action.payload, ...list]);
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const defaultState = {
  petList: [],
  pet: {
    name: '',
    attributes: {
      age: '',
      specie: '',
      breed: ''
    }
  },
}
export default function petsReducer(state = defaultState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
