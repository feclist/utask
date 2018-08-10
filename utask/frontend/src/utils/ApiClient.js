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
    list: async () => {
      const body = await this.GET('/task/')
      return body
    },
    retrieve: async id => {
      const body = await this.GET('/task/' + id)
      return body
    },
    create: async data => {
      const body = await this.POST('/task/', data)
      return body
    },
    startTask: async id => {
      const body = await this.GET('/task/' + id + '/start_task/')
      return body
    },
    finishTask: id => {
      return this.GET(`live_task/complete_task/${id}`)
    },
    userTasks: async () => {
      const body = await this.GET('/task/retrieve_user_tasks')
      return body
    },
    retrieveFromLiveTask: async id => {
      const body = await this.GET('/task/' + id + '/retrieve_from_live_task')
      return body
    },
    retrieveFromCompletedTask: async id => {
      const body = await this.GET(
        '/task/' + id + '/retrieve_from_completed_task'
      )
      return body
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
    retrieve: async () => {
      const body = await this.GET('/user/me/')
      return body
    },
    wallet: {
      retrieve: async () => {
        const body = await this.GET('/user/me/wallet/')
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
        list: async () => {
          const body = await this.GET('/user/me/wallet/transactions/')
          return body
        },
        retrieve: id => {
          this.POST('/user/me/wallet/transactions/' + id).then(response => {
            console.log(response)
          })
        }
      }
    },
    tasks: {
      list: async () => {
        const body = await this.GET('/user/me/tasks/')
        return body
      },
    }
  }
}
