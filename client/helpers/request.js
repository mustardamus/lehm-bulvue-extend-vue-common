const superagent = require('superagent')

module.exports = function (verb, url, query, cb) {
  if (typeof query === 'function') {
    cb = query
    query = {}
  }

  if (typeof cb === 'undefined') {
    cb = function () {}
  }

  let headers = { Accept: 'application/json' }
  let token = window.localStorage.getItem('Authorization')

  if (token) {
    headers.Authorization = token
  }

  if (url[0] !== '/') {
    url = '/' + url
  }

  superagent[verb](url)
    .set(headers)
    .query(query)
    .end((err, response) => {
      if (err) {
        cb(err)
      } else {
        cb(null, response.body)
      }
    })
}
