# Request Helper

This is a wrapper function that is using
[superaget](https://github.com/visionmedia/superagent) for Ajax requests.

- set the `Accept` header to `application/json`, so the server should return
  JSON
- if the `Authorization` key is found in `localStorage`, its value is set to the
  `Authorization` header, useful for Bearer jsonwebtokens
- prefixes the URL with `/` if not already done
- returns a callback with the response body if successful
- send query data (superagent.query()) on GET and DELETE requests
- send body data (superagent.send()) on POST and PUT requests

## Usage

You mainly want to use this helper in Actions, as only there Ajax requests
should happen, that in turn updates the State.

In `./client/actions/app.js` for example:

    const request = require('../helpers/request')

    module.exports = {
      getRequest () {
        request('GET', 'count', (err, res) => {
          // err = any error returned from server, otherwise null
          // res = JSON object returned by the server
          // you can ommit the first / in the url, will become /count
        })

        // passing some query data to the /count endpoint
        request('GET', 'count', { active: true }, (err, res) => {
          // req.query.active = true
        })
      },

      postRequest () {
        // passing some body data to the /article endpoint
        request('POST', '/article', { content: 'some text', userId: 13 }, (err, res) => {
          // req.body = { content: 'some text', userId: 13 }
        })
      },

      putRequest () {
        request('PUT', 'article/16', { body: 'changed' }, (err, res) => {

        })
      },

      deleteRequest () {
        request('DELETE', 'article/16', (err, res) => {

        })
      }
    }


## Mocking Requests

Also incorparated in the helper is a request mocking feature built on
[superagent-mocker](https://github.com/A/superagent-mocker). That way you can
develop the front-end without having a back-end in place.

The mocking feature is only included in the development build via the
[Browserify Envify transform](https://github.com/hughsk/envify).

See the [Request Mocks Docs](./request-mocks.md) for further instructions on how
to set it up and how it works.
