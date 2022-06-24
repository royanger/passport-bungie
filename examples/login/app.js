const express = require('express')
const passport = require('passport')
const util = require('util')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const BungieStrategy = require('passport-bungie').Strategy
const partials = require('express-partials')

// var BUNGIE_CLIENT_ID = '--insert-bungie-client-id-here--'
// var BUNGIE_CLIENT_SECRET = '--insert-bungie-client-secret-here--'
// var BUNGIE_APIKEY = '--insert-bungie-api-key-here--'
// var CALLBACK_URI = '--insert-callback-uri-here--'

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Bungie profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
   done(null, user)
})

passport.deserializeUser(function (obj, done) {
   done(null, obj)
})

// Use the BungieStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(
   new BungieStrategy(
      {
         clientID: BUNGIE_CLIENT_ID,
         clientSecret: BUNGIE_CLIENT_SECRET,
         callbackURL: CALLBACK_URI,
         customHeaders: { 'X-API-KEY': BUNGIE_APIKEY },
      },
      function (accessToken, refreshToken, profile, done) {
         // asynchronous verification, for effect...
         process.nextTick(function () {
            // To keep the example simple, the user's Bungie profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Bungie account with a user record in your database,
            // and return that user instead.
            return done(null, profile)
         })
      }
   )
)

var app = express()

// configure Express
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(partials())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(
   session({ secret: 'keyboard cat', resave: false, saveUninitialized: false })
)
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
   res.render('index', { user: req.user })
})

app.get('/account', ensureAuthenticated, function (req, res) {
   res.render('account', { user: req.user })
})

app.get('/login', function (req, res) {
   res.render('login', { user: req.user })
})

// GET /auth/bungie
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Bungie authentication will involve redirecting
//   the user to bungie.net.  After authorization,Bungie will redirect the user
//   back to this application at /auth/bungie/callback
app.get('/auth/bungie', passport.authenticate('bungie'), function (req, res) {
   // The request will be redirected to Bungie for authentication, so this
   // function will not be called.
})

// GET /auth/bungie/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
   '/auth/bungie/callback',
   passport.authenticate('bungie', { failureRedirect: '/login' }),
   function (req, res) {
      res.redirect('/')
   }
)

app.get('/logout', function (req, res, next) {
   req.logout(function (err) {
      if (err) return next(err)
      res.redirect('/')
   })
})

app.listen(3000)

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
      return next()
   }
   res.redirect('/login')
}
