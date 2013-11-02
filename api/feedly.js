function FeedlyAPI(authCode, feedlyServer, client_id, client_secret, feedly_redirect) {
	"use strict";
	
	/* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof FeedlyAPI)) {
        console.log('Warning: FeedlyAPI constructor called without "new" operator');
        return new FeedlyAPI(authCode);
    }
	
	var authToken, refreshToken, CSRF_STATE = "foo";
	var http = require("http");
	var request = require("request");
	var querystring = require("querystring");
	
	this.saveToken = function(token, refresh_token) {
		authToken = token;
		refreshToken = refresh_token;
	}
	
	this.getSavedAuthToken = function() {
		return authToken;
	}
	
	this.getSavedRefreshToken = function() {
		return refreshToken;
	}
	
	this.getAuthToken = function() {
		"use strict";
				
		var data = {
			grant_type: "authorization_code",
			code: authCode,
			redirect_uri: feedly_redirect,
			client_id: client_id, 
			client_secret: client_secret
		}
		
		var options = {
			url: feedlyServer + '/v3/auth/token',
			method: 'POST', 
			form: data
		}
		
		request.post(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log(body);
			saveToken(json.access_token, json.refresh_token);
			console.log(getSavedRefreshToken());
		});		
	}
	
	this.refreshAuthToken = function() {
		"use strict";
		
		var data = {
			refresh_token: refreshToken,
			grant_type: "authorization_code",
			client_id: client_id, 
			client_secret: client_secret
		}
		
		var options = {
			url: feedlyServer + '/v3/auth/token',
			method: 'POST',
			form: data
		}

		
		request.post(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			saveToken(json.access_token, null);
		});
	}
	
	this.getFeedInfo = function(feedId) {
		"use strict";
		
		var options = {
			url: feedlyServer + '/v3/feeds/'+feedId,
			method: 'GET',
			access_token: authToken,
			client_id: client_id, 
			client_secret: client_secret
		}

		console.log("getFeedInfo Options= " + querystring.stringify(options));
		
		request.post(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("getFeed Info  ====    "+json);
			return json;
		});
		
	}
}

module.exports.FeedlyAPI = FeedlyAPI;