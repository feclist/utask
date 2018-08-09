export const RETRIEVE_ME = 'RETRIEVE_ME'
export const SET_APICLIENT = 'SET_APICLIENT'

export const fetchUser = apiClient => ({
  type: RETRIEVE_ME,
  payload: apiClient.me.retrieve()
})

export const setApiClient = client => ({
  type: SET_APICLIENT,
  payload: client
})
