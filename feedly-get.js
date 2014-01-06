function FeedlyGet(authCode, feedlyServer, client_id, client_secret, feedly_redirect, csrf_state) {
	"use strict";
	
    if (false === (this instanceof FeedlyGet)) {
        console.log('Warning: FeedlyGet constructor called without "new" operator --- dont pollute the global object!');
        return new FeedlyGet(authCode, feedlyServer, client_id, client_secret, feedly_redirect, csrf_state);
    }
	
	this.authCode = authCode;
	this.feedlyServer = feedlyServer;
	this.client_id = client_id;
	this.client_secret = client_secret;
	this.feedly_redirect = feedly_redirect;
	this.CSRF_STATE = csrf_state;

	var http = require("http"), request = require("request"), Promise = require('promiscuous');
	
	this.saveToken = function(token, refresh_token) {
		console.log('token saved')
		this.authToken = token;
		this.refreshToken = refresh_token;
	}
	
	this.getSavedAuthToken = function() {
		return this.authToken;
	}
	
	this.getSavedRefreshToken = function() {
		return this.refreshToken;
	}
	
	//TODO -  Fix my junit 
	this.init = function() {
				
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
		
		var that = this;
		return new Promise(function(resolve, reject) {
			request.post(options, function(err, res, body) {
				if(err) {
					console.log('promise failed');
					reject(new Error(err));
				}
				else {
					var json = JSON.parse(body);
					if(typeof json.errorCode != 'undefined') {
						console.log('profile error ' + body);
						reject(new Error(json.errorMessage)); //TODO Charles - handle rejected promises
					} else {
						console.log("\n\n\n get auth token response === " +body);
						that.saveToken(json.access_token, json.refresh_token);
						resolve(json.access_token);
					}
				}
			});
		});	
	}
	
	//TODO -  Fix my junit 
	this.refreshAuthToken = function() {

		var data = {
			refresh_token: this.refreshToken,
			client_id: this.client_id, 
			client_secret: this.client_secret,
			grant_type: "authorization_code"
			
		}
		
		var options = {
			url: this.feedlyServer + '/v3/auth/token',
			form: data
		}
		
		var that = this;
		
		return new Promise(function(resolve, reject) {
			request.post(options, function(err, res, body) {
				if(err) {
					console.log('promise failed');
					reject(new Error(err));
				}
				else {
					var json = JSON.parse(body);
					if(typeof json.errorCode != 'undefined') {
						console.log('profile error ' + body);
						reject(new Error(json.errorMessage));
					} else {
						console.log("\n\n\n refresh auth token response  ===="    +body);
						that.saveToken(json.access_token, null);
						resolve(json);
					}
				}
			});
		});
	}
	
	this.get = function(uri, requiresAuth) {
		
		var options = {
			url: this.feedlyServer + uri
		}
		
		if(requiresAuth){
			options.headers = {authorization: " OAuth "+ this.authToken};
		}
		
		return new Promise(function(resolve, reject) {
			request.get(options, function(err, res, body) {
				if(err) {
					console.log('promise failed');
					console.log('error: body');
					reject(new Error(err));
				}
				else {
					var json = JSON.parse(body);
					console.log('promise success');
					console.log("\n\n\n" +uri+ "  ====    "+body);

					resolve(json);
				}
			});
		});
	}
	
	this.getFeedInfo = function(feedId) {
		return this.get('/v3/feeds/'+encodeURIComponent(feedId), false);
	}
	
	this.getEntry = function(entryId) {
		return this.get('/v3/entries/'+encodeURIComponent(entryId), false);
	}
	
	this.getStreamEntryIds = function(streamId) {
		return this.get('/v3/streams/ids?streamId=' +encodeURIComponent(streamId), true);	
	}
	
	this.getStreamContents = function(streamId) {
		return this.get('/v3/streams/contents?streamId=' +encodeURIComponent(streamId), true);
	}
	
	this.getStreamMixContents = function(streamId) {
		return this.get('/v3/mixes/contents?streamId=' +encodeURIComponent(streamId), true);
	}
	
	this.searchFeeds = function(hint) {
		return this.get('/v3/search/feeds?q='+encodeURIComponent(hint), false);
	}
	
	this.getUserProfile = function() {
		return this.get('/v3/profile', true);
	}

	this.getUserSubscriptions = function() {
		return this.get('/v3/subscriptions', true);
	}

	this.getUserCategories = function() {
		return this.get('/v3/categories', true);
	}  
	
	this.getUserTags = function() {
		return this.get('/v3/tags', true);
	}
}

module.exports.FeedlyGet = FeedlyGet;