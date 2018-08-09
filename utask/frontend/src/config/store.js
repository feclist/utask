import reducer from '../reducers'
import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

export const history = createHistory()
const router = routerMiddleware(history)

const initialize = (initialState = {}) => {
  return createStore(reducer, initialState, composeWithDevTools(
    applyMiddleware(promiseMiddleware(), thunk, router)
  ))
}

export default initialize
