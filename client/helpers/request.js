let superagent = require('superagent')

if (process.env.NODE_ENV === 'development') {
  let activated = window.localStorage.getItem('mock-requests')
  let initialized = window.requestMockInitialized

  if (activated && !initialized) {
    let mock = require('superagent-mocker')(superagent)
    let mocksObj = require('../mocks/request/*.js', { mode: 'hash' })

    for (let mockNamespace in mocksObj) {
      let mockArr = mocksObj[mockNamespace]
      let urlArr = []

      for (let mockObj of mockArr) {
        if (!mockObj.url || typeof mockObj.url !== 'string') {
          console.log(`Request Mock: "${mockNamespace}" must return a "url" String`)
          continue
        }

        if (!mockObj.cb || typeof mockObj.cb !== 'function') {
          console.log(`Request Mock: "${mockNamespace}" must return a "cb" Function`)
          continue
        }

        let split = mockObj.url.split(' ')
        let verb = split[0].toLowerCase()
        let url = split[1]

        if (verb === 'delete') {
          verb = 'del'
        }

        if (verb !== 'get' && verb !== 'post' && verb !== 'put' && verb !== 'del') {
          console.log(`Request Mock: "${mockNamespace}", verb in "url" field must be "GET", "POST", "PUT" or "DELETE"`)
          continue
        }

        mock[verb](url, mockObj.cb)
        urlArr.push(mockObj.url)
      }

      console.log(`Request Mock: "${mockNamespace}" initialized URLs: ${urlArr.join(' | ')}`)
    }

    window.requestMockInitialized = true
  }
}

const request = function (verb, url, query, cb) {
  if (typeof query === 'function') {
    cb = query
    query = {}
  }

  if (typeof cb === 'undefined') {
    cb = function () {}
  }

  let headers = { Accept: 'application/json' }
  let token = window.localStorage.getItem('Authorization')
  let dataMethod = 'query' // for GET and DELETE
  verb = verb.toLowerCase()

  if (token) {
    headers.Authorization = token
  }

  if (url[0] !== '/') {
    url = '/' + url
  }

  if (verb === 'post' || verb === 'put') {
    dataMethod = 'send'
  }

  let request = superagent[verb](url)

  request[dataMethod](query)
  request
    .set(headers)
    .end((err, response) => {
      if (err) {
        cb(err)
      } else {
        cb(null, response.body || response)
      }
    })
}

module.exports = request
