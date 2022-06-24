/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function (json) {
   if ('string' == typeof json) {
      json = JSON.parse(json)
   }

   var profile = {}
   profile.membershipId = String(json.Response.bungieNetUser.membershipId)
   profile.uniqueName = json.Response.bungieNetUser.uniqueName
   profile.displayName = json.Response.bungieNetUser.displayName
   profile.profilePicture = json.Response.bungieNetUser.profilePicture
   profile.profileTheme = json.Response.bungieNetUser.profileTheme
   profile.userTitle = json.Response.bungieNetUser.userTitle
   profile.successMessageFlags = json.Response.bungieNetUser.successMessageFlags
   profile.isDeleted = json.Response.bungieNetUser.isDeleted
   profile.about = json.Response.bungieNetUser.about
   profile.firstAccess = json.Response.bungieNetUser.firstAccess
   profile.lastUpdate = json.Response.bungieNetUser.lastUpdate
   profile.context = {
      isFollowing: json.Response.bungieNetUser.context.isFollowing,
      ignoreStatus: {
         isIgnored: json.Response.bungieNetUser.context.ignoreStatus.isIgnored,
         ignoreFlags:
            json.Response.bungieNetUser.context.ignoreStatus.ignoreFlags,
      },
   }
   profile.showActivity = json.Response.bungieNetUser.showActivity
   profile.locale = json.Response.bungieNetUser.locale
   profile.localeInheritDefault =
      json.Response.bungieNetUser.localeInheritDefault
   profile.showGroupMessaging = json.Response.bungieNetUser.showGroupMessaging
   profile.profilePicturePath = json.Response.bungieNetUser.profilePicturePath
   profile.profileThemeName = json.Response.bungieNetUser.profileThemeName
   profile.userTitleDisplay = json.Response.bungieNetUser.userTitleDisplay
   profile.statusText = json.Response.bungieNetUser.statusText
   profile.statusDate = json.Response.bungieNetUser.statusDate
   profile.blizzardDisplayName = json.Response.bungieNetUser.blizzardDisplayName
   profile.steamDisplayName = json.Response.bungieNetUser.steamDisplayName
   profile.twitchDisplayName = json.Response.bungieNetUser.twitchDisplayName
   profile.cachedBungieGlobalDisplayName =
      json.Response.bungieNetUser.cachedBungieGlobalDisplayName
   profile.cachedBungieGlobalDisplayNameCode =
      json.Response.bungieNetUser.cachedBungieGlobalDisplayNameCode
   profile.destinyMemberships = json.Response.destinyMemberships

   return profile
}
