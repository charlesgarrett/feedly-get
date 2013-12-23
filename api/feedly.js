function FeedlyAPI(authCode, authToken, feedlyServer, client_id, client_secret, feedly_redirect, csrf_state) {
	"use strict";
	
    if (false === (this instanceof FeedlyAPI)) {
        console.log('Warning: FeedlyAPI constructor called without "new" operator --- dont pollute the global object!');
        return new FeedlyAPI(authCode, authToken, feedlyServer, client_id, client_secret, feedly_redirect, csrf_state);
    }
	
	this.authCode = authCode;
	this.authToken = authToken;
	this.feedlyServer = feedlyServer;
	this.client_id = client_id;
	this.client_secret = client_secret;
	this.feedly_redirect = feedly_redirect;
	this.CSRF_STATE = csrf_state;

	var http = require("http"), request = require("request");
	
	this.saveToken = function(token, refresh_token) {
		this.authToken = token;
		this.refreshToken = refresh_token;
	}
	
	this.getSavedAuthToken = function() {
		return this.authToken;
	}
	
	this.getSavedRefreshToken = function() {
		return this.refreshToken;
	}
	
	this.getAuthToken = function() {
		"use strict";
				
		var data = {
			grant_type: "authorization_code",
			code: this.authCode,
			redirect_uri: this.feedly_redirect,
			client_id: this.client_id, 
			client_secret: this.client_secret
		}
		
		var options = {
			url: feedlyServer + '/v3/auth/token',
			form: data
		}
		
		request.post(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("\n\n\n get auth token response === " +body);
			saveToken(json.access_token, json.refresh_token);
		});		
	}
	
	this.refreshAuthToken = function() {
		"use strict";
		
		var data = {
			refresh_token: this.refreshToken,
			grant_type: "authorization_code",
			client_id: this.client_id, 
			client_secret: this.client_secret
		}
		
		var options = {
			url: this.feedlyServer + '/v3/auth/token',
			form: data
		}
		
		request.post(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("\n\n\naccess_token: " +json.access_token);
			saveToken(json.access_token, null);
		});
	}
	
	this.get = function(uri, requiresAuth, callback) {
		"use strict";
		
		var options = {
			url: this.feedlyServer + uri
		}
		
		if(requiresAuth){
			options.headers = {authorization: " OAuth "+ authToken};
		}
		
		request.get(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("\n\n\n" +uri+ "  ====    "+body);
			
			return callback(json);
		});
	}
	
	this.getFeedInfo = function(feedId, callback) {
		this.get('/v3/feeds/'+encodeURIComponent(feedId), false, callback);
	}
	
	this.getEntry = function(entryId, callback) {
		this.get('/v3/entries/'+encodeURIComponent(entryId), false, callback);
	}
	
	this.getStreamEntryIds = function(streamId, callback) {
		this.get('/v3/streams/ids?streamId=' +encodeURIComponent(streamId), true, callback);	
	}
	
	this.getStreamContents = function(streamId, callback) {
		this.get('/v3/streams/contents?streamId=' +encodeURIComponent(streamId), true, callback);
	}
	
	this.getStreamMixContents = function(streamId, callback) {
		this.get('/v3/mixes/contents?streamId=' +encodeURIComponent(streamId), true, callback);
	}
	
	this.searchFeeds = function(hint, callback) {
		this.get('/v3/search/feeds?q='+encodeURIComponent(hint), false, callback);
	}
	
	this.getUserProfile = function(callback) {
		this.get('/v3/profile', true, callback);
	}

	this.getUserSubscriptions = function(callback) {
		this.get('/v3/subscriptions', true, callback);
	}

	this.getUserCategories = function(callback) {
		this.get('/v3/categories', true, callback);
	}  
	
	this.getUserTags = function(callback) {
		this.get('/v3/tags', true, callback);
	}
}

module.exports.FeedlyAPI = FeedlyAPI;