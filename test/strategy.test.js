/* global describe, it, expect */
/* jshint expr: true */

var BungieStrategy = require('../lib/strategy');

describe('Strategy', function () {
   var strategy = new BungieStrategy(
      {
         clientID: 'ABC123',
         clientSecret: 'secret',
      },
      function () {}
   );

   it('should be named bungie', function () {
      expect(strategy.name).to.equal('bungie');
   });

   it('should have default user agent', function () {
      expect(strategy._oauth2._customHeaders['User-Agent']).to.equal(
         'passport-bungie'
      );
   });

   describe('constructed with custom headers including X-API-Key', function () {
      var strategy = new BungieStrategy(
         {
            clientID: 'ABC123',
            clientSecret: 'secret',
            customHeaders: { 'X-API-Key': 'ABCDEGH' },
         },
         function () {}
      );

      it('should have default X-API-Key', function () {
         expect(strategy._oauth2._customHeaders['X-API-Key']).to.equal(
            'ABCDEGH'
         );
      });
   });
});
