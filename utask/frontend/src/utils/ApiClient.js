import RestClient from './RestClient'

/**
 * API docs hosted on the backend at /api/documentation
 */
export default class ApiClient extends RestClient {
  constructor(baseUrl) {
    console.log('constructing apiClient with base: ', baseUrl)
    super(baseUrl, {})
  }

  tasks = {
    list: () => {
      return this.GET('/task/')
    },
    retrieve: id => {
      return this.GET(`/task/${id}`)
    },
    create: data => {
      return this.POST('/task/', data)
    },
    startTask: id => {
      return this.GET(`/task/${id}/start_task/`)
    },
    finishTask: id => {
      return this.GET(`/live_task/${id}/complete_task`)
    },
    userTasks: () => {
      return this.GET('/task/retrieve_user_tasks')
    },
    retrieveFromTask: id => {
      return this.GET(`/live_task/${id}/retrieve_from_task`)
    },
    retrieveFromLiveTask: async id => {
      return this.GET(`/task/${id}/retrieve_from_live_task`)
    },
    retrieveFromCompletedTask: async id => {
      return this.GET(`/task/${id}/retrieve_from_completed_task`)
    }
  }

  users = {
    // This isn't actually supposed to be here..
    login: async (username, pass) => {
      const body = await this.POST('/obtain-auth-token/', {
        username: username,
        password: pass
      })
      if ('token' in body) window.localStorage.token = body.token
      return body
    },
    // Nor is this...
    logout: () => {
      window.localStorage.removeItem('token')
    },
    list: () => {
      this.GET('/user/').then(response => {
        console.log(response)
      })
    },
    retrieve: id => {
      this.GET('/user/' + id).then(response => {
        console.log(response)
      })
    }
  }
  me = {
    retrieve: () => {
      return this.GET('/user/me/')
    },
    wallet: {
      retrieve: () => {
        return this.GET('/user/me/wallet/')
        return body
      },
      effectiveFunds: async () => {
        const body = await this.GET('/user/me/wallet/effective_funds')
        return body
      },
      buy: amount => {
        this.POST('/user/me/wallet/buy/' + amount).then(response => {
          console.log(response)
        })
      },
      sell: amount => {
        this.POST('/user/me/wallet/sell/' + amount).then(response => {
          console.log(response)
        })
      },
      transactions: {
        list: () => {
          return this.GET('/user/me/wallet/transactions/')
        },
        retrieve: id => {
          this.POST('/user/me/wallet/transactions/' + id).then(response => {
            console.log(response)
          })
        }
      }
    },
    tasks: {
      list: () => {
        return this.GET('/user/me/tasks/')
      }
    }
  }
}
