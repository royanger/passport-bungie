/**
 * Module dependencies.
 */
var util = require('util'),
   OAuth2Strategy = require('passport-oauth2'),
   Profile = require('./profile'),
   InternalOAuthError = require('passport-oauth2').InternalOAuthError

/**
 * `Strategy` constructor.
 *
 * The Bungie authentication strategy authenticates requests by delegating to
 * Bungie using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`       your Bungie application's Client ID
 *   - `clientSecret`   your Bungie application's Client Secret
 *   - `callbackURL`    URL to which Bungie will redirect the user after granting authorization
 *   - `customHeaders`  set to { 'X-API-KEY': process.env.BUNGIE_APIKEY }
 *
 * Examples:
 *
 *     passport.use(new BungieStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/bungie/callback',
 *         customHeader: { 'X-API-KEY': 'sd9f9d8sdf0as9d8f0s9d8f' }
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
   options = options || {}
   options.authorizationURL =
      options.authorizationURL || 'https://www.bungie.net/en/OAuth/Authorize'
   options.tokenURL =
      options.tokenURL || 'https://www.bungie.net/Platform/App/OAuth/Token/'
   options.scopeSeparator = options.scopeSeparator || ','
   options.customHeaders = options.customHeaders || {}

   if (!options.customHeaders['User-Agent']) {
      options.customHeaders['User-Agent'] =
         options.userAgent || 'passport-bungie'
   }

   OAuth2Strategy.call(this, options, verify)
   this.name = options.name || 'bungie'
   this._userProfileURL =
      options.userProfileURL ||
      'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/'
   this._oauth2.useAuthorizationHeaderforGET(true)
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy)

/**
 * Retrieve user profile from Bungie.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `bungie`
 *
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
   var self = this

   this._oauth2.get(
      this._userProfileURL,
      accessToken,
      function (err, body, res) {
         var json

         if (err) {
            return done(
               new InternalOAuthError('Failed to fetch user profile', err)
            )
         }

         try {
            json = JSON.parse(body)
         } catch (ex) {
            return done(new Error('Failed to parse user profile'))
         }

         var profile = Profile.parse(json)
         profile.provider = 'bungie'
         profile._raw = body
         profile._json = json

         done(null, profile)
      }
   )
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy
