import { combineReducers } from 'redux'
import account from './account'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  account,
  router: routerReducer
})
