
export default class RestClient {
  constructor(baseUrl = '', { headers = {} } = {}) {
    if (!baseUrl) throw new Error('missing baseUrl')
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    Object.assign(this.headers, headers)
    this.baseUrl = baseUrl
  }

  async _parseIfJson(response) {
    var contentType = response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json()
    }
    return null
  }

  async _handleError(response) {
    const body = await this._parseIfJson(response)
    if (!body) {
      console.error('no json as response')
    }
    return body
  }

  _fullRoute(url) {
    return `${this.baseUrl}${url}`
  }

  async _fetch(route, method, body, isQuery = false) {
    if (!route) throw new Error('Route is undefined')
    // When there is no internet connection, navigate to the BlockScreen
    var fullRoute = this._fullRoute(route)
    if (isQuery && body) {
      var qs = require('qs')
      const query = qs.stringify(body)
      fullRoute = `${fullRoute}?${query}`
      body = undefined
    }

    // Add authorization header is auth token is present
    const authHeader = window.localStorage.token ? {
      'Authorization': 'Token ' + window.localStorage.token
    } : {}

    let opts = {
      method,
      headers: Object.assign(this.headers, authHeader)
    }
    if (body) {
      Object.assign(opts, { body: JSON.stringify(body) })
    }
    let promise = await fetch(fullRoute, opts)
    console.log('Logging response =>')
    console.log(promise)
    return this._handleError(promise)
  }

  GET(route, query) { return this._fetch(route, 'GET', query, true) }
  POST(route, body) { return this._fetch(route, 'POST', body) }
  PUT(route, body) { return this._fetch(route, 'PUT', body) }
  DELETE(route, query) { return this._fetch(route, 'DELETE', query, true) }
}
