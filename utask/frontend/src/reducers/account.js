import typeToReducer from 'type-to-reducer'
import { RETRIEVE_ME, SET_APICLIENT } from '../actions/account'
import ApiClient from '../utils/ApiClient'

const initialState = {
  me: null,
  apiClient: new ApiClient('/api')
}

export default typeToReducer(
  {
    [RETRIEVE_ME]: {
      PENDING: (state, action) => ({
        ...state
      }),
      REJECTED: (state, action) => ({
        ...state
      }),
      FULFILLED: (state, action) => ({
        ...state,
        me: action.payload
      })
    },
    [SET_APICLIENT]: (state, action) => ({
      ...state,
      apiClient: action.payload
    })
  },
  initialState
)
