/* global describe, it, expect, before */
/* jshint expr: true */

const { expect } = require('chai');

var fs = require('fs'),
   parse = require('../lib/profile').parse;

describe('profile.parse', function () {
   describe('example profile', function () {
      var profile;

      before(function (done) {
         fs.readFile('test/data/example.json', 'utf8', function (err, data) {
            if (err) {
               return done(err);
            }
            profile = parse(data);
            done();
         });
      });

      it('should parse profile', function () {
         expect(profile.membershipId).to.equal('1');
         expect(profile.uniqueName).to.equal('octocat#7180');
         expect(profile.displayName).to.equal('octocat');
         expect(profile.profilePicture).to.equal(70693);
         expect(profile.profilePicturePath).to.equal(
            '/img/profile/avatars/cc65.jpg'
         );
         expect(profile.steamDisplayName).to.equal('octocat');
         expect(profile.locale).to.equal('en');
         expect(profile.isDeleted).to.equal(false);
         expect(profile.destinyMemberships[0].membershipType).to.equal(3);
         expect(profile.destinyMemberships[0].membershipId).to.equal(
            '4611686018481985948'
         );
         expect(profile.destinyMemberships[0].bungieGlobalDisplayName).to.equal(
            'octocat'
         );
      });
   });
});
