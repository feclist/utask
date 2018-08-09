import RestClient from './RestClient'
import { TableBody } from '../../node_modules/@material-ui/core';

/**
 * API docs hosted on the backend at /api/documentation
 */
export default class ApiClient extends RestClient {
  constructor(baseUrl) {
    console.log('constructing apiClient with base: ', '/api')
    super(baseUrl, {})
  }

  tasks = {
    list: async () => {
      const body = await this.GET('/task/')
      console.log(body)
      return body
    },
    retrieve: async (id) => {
      const body = await this.GET('/task/' + id)
      console.log(body)
      return body
    },
    create: async (data) => {
      const body = await this.POST('/task/', data)
      console.log(body)
      return body
    },
    startTask: async (id) => {
      const body = await this.GET('/task/' + id + '/start_task/')
      console.log(body)
      return body
    },
    userTasks: async () => {
      const body = await this.GET('/task/retrieve_user_tasks')
      console.log(body)
      return body
    }
  }

  users = {
    // This isn't actually supposed to be here..
    login: async (username, pass) => {
      const body = await this.POST('/obtain-auth-token/', { username: username, password: pass })
      console.log(body)
      if ('token' in body) window.localStorage.token = body.token
      return body
    },
    // Nor is this...
    logout: () => {
      window.localStorage.removeItem('token')
    },
    list: () => {
      this.GET('/user/').then((response) => {
        console.log(response)
      })
    },
    retrieve: (id) => {
      this.GET('/user/' + id).then((response) => {
        console.log(response)
      })
    }
  }
  me = {
    retrieve: async () => {
      const body = await this.GET('/user/me/')
      console.log(body)
      return body
    },
    wallet: {
      retrieve: async () => {
        const body = await this.GET('/user/me/wallet/')
        console.log(body)
        return body
      },
      effectiveFunds: async () => {
        const body = await this.GET('/user/me/wallet/effective_funds')
        console.log(body)
        return body
      },
      buy: (amount) => {
        this.POST('/user/me/wallet/buy/' + amount).then((response) => {
          console.log(response)
        })
      },
      sell: (amount) => {
        this.POST('/user/me/wallet/sell/' + amount).then((response) => {
          console.log(response)
        })
      },
      transactions: {
        list: async () => {
          const body = await this.GET('/user/me/wallet/transactions/')
          console.log(body)
          return body
        },
        retrieve: (id) => {
          this.POST('/user/me/wallet/transactions/' + id).then((response) => {
            console.log(response)
          })
        }
      }
    }
  }


}
