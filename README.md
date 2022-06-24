# Passport-Bungie

[Passport](http://passportjs.org/) strategy for authenticating with [Bungie](https://www.bungie.net/)
using the OAuth 2.0 API.

This module lets you authenticate using Bungie in your Node.js applications.
By plugging into Passport, Bungie authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

```shell
$ npm install passport-bungie
```

## Usage

### Configure Strategy

The Bungie authentication strategy authenticates users using a [Bungie
application](https://www.bungie.net/en/Application) and OAuth 2.0 tokens.
The strategy requires a `verify` callback, which accepts these credentials
and calls `done` providing a user, as well as `options` specifying a
client ID, client secret, an API Key, and callback URL.

### IMPORTANT NOTE

Bungie requires the callback URL you set in the application to use https.
You can not use `http://localhost` even in development. You app, even in
development, must use https. You can solve this however you like. The
solution I found with the least friction was [ngrok](https://ngrok.com/).
You can use a free account for development and easily setup a proxy.

```javascript
passport.use(
   new GitHubStrategy(
      {
         clientID: BUNGIE_CLIENT_ID,
         clientSecret: BUNGIE_CLIENT_SECRET,
         callbackURL: 'https://127.0.0.1:3000/auth/bungie/callback',
         customHeaders: { 'X-API-KEY': BUNGIE_APIKEY },
      },
      function (accessToken, refreshToken, profile, done) {
         User.findOrCreate({ bungie: memberhipId }, function (err, user) {
            return done(err, user)
         })
      }
   )
)
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'bungie'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/bungie', passport.authenticate('bungie'))

app.get(
   '/auth/bungie/callback',
   passport.authenticate('bungie', { failureRedirect: '/login' }),
   function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/')
   }
)
```

## Examples

For a complete, working example, refer to the [login example](https://github.com/cfsghost/passport-github/tree/master/examples/login).

## Tests

```shell
$ npm install --dev
$ make test
```

[![Build Status](https://secure.travis-ci.org/cfsghost/passport-github.png)](http://travis-ci.org/cfsghost/passport-github)

## Credits

-  [Jared Hanson](http://github.com/jaredhanson)
-  [Fred Chien](http://github.com/cfsghost)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
