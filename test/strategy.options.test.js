/* global describe, it, expect, before */
/* jshint expr: true */

var GitHubStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  describe('loading profile using custom URL', function() {
    var strategy =  new GitHubStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://github.corpDomain/api/v3/user',
        userEmailURL: 'https://github.corpDomain/api/v3/emails'
      },
      function() {});

    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      var testcases = {
        'https://github.corpDomain/api/v3/user': '{ "login": "octocat", "id": 1, "name": "monalisa octocat", "email": "octocat@github.com", "html_url": "https://github.com/octocat" }',
		'https://github.corpDomain/api/v3/emails': '[ { "email": "octocat@github.com", "verified": true, "primary": true } ]'
      };

      var body = testcases[url] || null;
      if (!body)
        return callback(new Error('wrong url argument'));

      if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

      callback(null, body, undefined);
    };


    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('github');
      
      expect(profile.id).to.equal('1');
      expect(profile.username).to.equal('octocat');
      expect(profile.displayName).to.equal('monalisa octocat');
      expect(profile.profileUrl).to.equal('https://github.com/octocat');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('octocat@github.com');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });

  describe('loading profile to return all raw emails', function() {
    var strategy =  new GitHubStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        scope: [ 'user:email' ],
        allRawEmails: true
      },
      function() {});

    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      var testcases = {
        'https://api.github.com/user': '{ "login": "octocat", "id": 1, "name": "monalisa octocat", "email": "octocat@github.com", "avatar_url": "https://avatars1.githubusercontent.com/u/583231?v=3&s=460", "html_url": "https://github.com/octocat" }',
        'https://api.github.com/user/emails': '[ { "email": "octocat@github.com", "verified": true, "primary": true }, { "email": "nonprimarybutverified@github.com", "verified": true, "primary": false }, { "email": "unverified@pineapple.com", "verified": false, "primary": false } ]'
      };

      var body = testcases[url] || null;
      if (!body)
        return callback(new Error('wrong url argument'));

      if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

      callback(null, body, undefined);
    };


    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('github');

      expect(profile.id).to.equal('1');
      expect(profile.username).to.equal('octocat');
      expect(profile.displayName).to.equal('monalisa octocat');
      expect(profile.profileUrl).to.equal('https://github.com/octocat');
      expect(profile.emails).to.have.length(3);
      expect(profile.emails[0].value).to.equal('octocat@github.com');
      expect(profile.emails[0].verified).to.equal(true);
      expect(profile.emails[0].primary).to.equal(true);
      expect(profile.emails[1].value).to.equal('nonprimarybutverified@github.com');
      expect(profile.emails[1].verified).to.equal(true);
      expect(profile.emails[1].primary).to.equal(false);
      expect(profile.emails[2].value).to.equal('unverified@pineapple.com');
      expect(profile.emails[2].verified).to.equal(false);
      expect(profile.emails[2].primary).to.equal(false);
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
});
