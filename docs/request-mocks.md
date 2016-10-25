# Request Mocks

This feature is included in the [Request Helper](./request-helper.md), but only
included the development build and if certain settings are met (see below). It
is built on [superagent-mocker](https://github.com/A/superagent-mocker).


## Activate the request mocks

By default this feature is deactivated, so ajax requests are actually passed to
the server. In order to activate it, you have to set the `localStorage` key
`mock-requests` to a truthy value (a `String` for example):

    localStorage.setItem('mock-requests', 'true')

Now, if you properly defined a URL to mock (see below), instead of passing it to
the server it will return anything you want in the `cb` callback.


## Defining URL's to mock

All definitions are stored in `./mocks/request/*.js` files and initialized
dynamically. The filename is the namespace for the mocks, so you can nicely
separate them per resource.

Each file has to export a Array of Objects, each with two fields: `url` and
`cb`.

### `url`

This is a `String` that consists of a verb followed by a space and the actual
URL you want to mock. The verb can be either `GET`, `POST`, `PUT` or `DELETE`.
For example:

- `GET /articles`
- `GET /articles/:id`
- `POST /articles`
- `PUT /articles/:id`
- `DELETE /articles/:id`

### `cb`

This is the callback function that is triggered whenever a mocked URL is
requested by the Request Helper. Whatever is returned will be passed as response
body to the Request Helper. This should be an `Object` since it is configured
to consume JSON returned from the server. For example:

    cb (req) {
      return {
        status: 200,
        id: '123',
        title: 'The article title',
        content: 'This is too easy'
      }
    }

The `status` field indicates which status code the mock is returning. `200` is
the default and must not specifically set.

Notice the `req` argument that is passed to the callback. This is a `Object`
provided by superagent-mocker and has different useful informations:

    {
      url: '/articles/123',         // the full requested url
      headers: {                    // the headers that has been sent
        accept: 'application/json', // this header is always set by the request helper
        Authorization: 'jwt'        // this header is set if `Authorization` is set in localStorage
      },
      params: {                     // params you define in the url
        id: '123'                   // eg /articles/:id
      },
      query: {                      // the query data that have been sent along
        userId: '456'               // eg /articles/:id?userId=456
      },
      body: {                       // the request body sent on POST and PUT
        content: 'some content...'  // with some fields
      }                      
    }

Note that on `GET` and `DELETE` requests the `query` field will be set, but on
`POST` and `PUT` requests the `body` field will be set.


## Example

### `./client/mocks/request/articles.js`

    module.exports = [
      {
        url: 'GET /articles',
        cb (req) {
          return [
            { id: 123, title: 'Article One' },
            { id: 123, title: 'Article Two' }
          ]
        }
      },
      {
        url: 'GET /articles/:id',
        cb (req) {
          // req.params.id = 123
          // req.query.userId = 456
          return { id: 123, title: 'Article One' }
        }
      },
      {
        url: 'POST /articles',
        cb (req) {
          // req.body.title = 'Article Three'
          if (req.headers.authorization) { // note that header names are lowercase
            return { title: req.body.title }
          } else {
            return { status: 401, message: 'Must be logged in' }
          }
        }
      }
    ]

### `request()` calls somewhere

    request('GET', '/articles', (err, res) => {
      // res -> { status: 200, articles: Array[2] }
    })

    request('GET', '/articles/123', { userId: 456 }, (err, res) => {
      // res -> { status: 200, id: "123", title: "Article One", userId: "456" }
    })

    localStorage.removeItem('Authorization')

    request('POST', '/articles', { title: 'Article Three' }, (err, res) => {
      // err.message -> "401"
    })

    localStorage.setItem('Authorization', 'yes')

    request('POST', '/articles', { title: 'Article Three' }, (err, res) => {
      // res -> { status: 200, id: 789, title: "Article Three" }
    })
