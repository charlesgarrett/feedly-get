function FeedlyAPI(authCode, token, feedlyServer, client_id, client_secret, feedly_redirect) {
	"use strict";
	
	/* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof FeedlyAPI)) {
        console.log('Warning: FeedlyAPI constructor called without "new" operator');
        return new FeedlyAPI(authCode, token, feedlyServer, client_id, client_secret, feedly_redirect);
    }
	
	var authToken = token, refreshToken, CSRF_STATE = "foo";
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
	
	
	
	//TODO Charles - after tests pass, refactor duplicate code
	
	
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
			form: data
		}
		
		request.post(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log(body);
			saveToken(json.access_token, json.refresh_token);
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
			form: data
		}
		
		request.post(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("access_token: " +json.access_token);
			saveToken(json.access_token, null);
		});
	}
	
	this.getFeedInfo = function(feedId, callback) {
		"use strict";
							
		var options = {
			url: feedlyServer + '/v3/feeds/'+encodeURIComponent(feedId)
		};
			
		request(options, function(err, res, body) {
			if(err) throw err;
		
			//console.log(body);
			return callback(JSON.parse(body));
		}); 
		
		/* console.log(JSON.stringify(options));
		
		http.get(options, function(res) {
		  console.log("Got response: " + JSON.stringify(res));
		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		}); */
	}

	this.getEntry = function(entryId, callback) {
		"use strict";
		
		var options = {
			url: feedlyServer + '/v3/entries/' + encodeURIComponent(entryId),
		}
		
		request.get(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("getEntry Info  ====    "+body);
			
			return callback(JSON.parse(body));
		});
	}
	

	this.getUserProfile = function(callback) {
		"user strict";
		
		var options = {
			url: feedlyServer + '/v3/profile',
			headers: {authorization: " OAuth "+ authToken}
		}
		
		
		request.get(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("getUserProfile Info  ====    "+body);
			
			return callback(JSON.parse(body));
		});
	}
	
	//TODO Charles - add the URI for get user subscriptions
	this.getUserSubscriptions = function(userId, callback) {
		"use strict";
		
		var options = {
			uri: feedlyServer + '' + userId,
			access_token: authToken
		}
		
		console.log("getUserSubscriptions Options= " + querystring.stringify(options));
		
		request.get(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("getUserSubscriptions Info  ====    "+json);
			
			return callback(json);
		});
	}
	
	//TODO Charles - add get user categories URI
	this.getUserCategories = function(userId, callback) {
		"use strict";
		
		var options = {
			uri: feedlyServer + '' + userId,
			access_token: authToken
		}
		
		console.log("getUserCategories Options= " + querystring.stringify(options));
		
		request.get(options, function(err, res, body) {
			if(err) throw err;
			
			var json = JSON.parse(body);
			console.log("getUserCategories Info  ====    "+json);
			
			return callback(json);
		}); 
	}  
}

module.exports.FeedlyAPI = FeedlyAPI;