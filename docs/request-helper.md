# Request Helper

This is a wrapper function that is using
[superaget](https://github.com/visionmedia/superagent) for Ajax requests.

- set the `Accept` header to `application/json`, so the server should return
  JSON
- if the `Authorization` key is found in `localStorage`, its value is set to the
  `Authorization` header, useful for Bearer jsonwebtokens
- prefixes the URL with `/` if not already done
- returns a callback with the response body if successful

## Usage

You mainly want to use this helper in Actions, as only there Ajax requests
should happen, that in turn updates the State.

In `./client/actions/app.js` for example:

    const request = require('../helpers/request')

    module.exports = {
      getRequest () {
        request('get', 'count', (err, res) => {
          // err = any error returned from server, otherwise null
          // res = JSON object returned by the server
          // you can ommit the first / in the url, will become /count
        })
      },

      postRequest () {
        // passing some data to the /article endpoint
        request('post', '/article', { body: 'some text', userId: 13 }, (err, res) => {

        })
      },

      putRequest () {
        request('put', 'article/16', { body: 'changed' }, (err, res) => {

        })
      },

      deleteRequest () {
        request('delete', 'article/16', (err, res) => {

        })
      }
    }
