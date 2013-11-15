describe("Behavior contract for the feedly API controller", function() {
	"use strict";
	
 	var feedly, FeedlyAPI = require('../api/feedly').FeedlyAPI;
var querystring = require("querystring");

	var authCode = "AQAAjVh7ImkiOiI2YWZlZDdmYS01YTU3LTRjOTYtYTEyYy00ZjJiMmIyODgxYTYiLCJ1IjoiMTM0MDM5NzQyNiIsImEiOiJGZWVkbHkgc2FuZGJveCBjbGllbnQiLCJwIjo0LCJ0IjoxMzg0NDg1MTM1ODM3fQ";
	var authToken = "AQAAg0V7ImkiOiI2YWZlZDdmYS01YTU3LTRjOTYtYTEyYy00ZjJiMmIyODgxYTYiLCJhIjoiRmVlZGx5IHNhbmRib3ggY2xpZW50IiwicCI6NCwidCI6MSwidiI6InNhbmRib3giLCJ4Ijoic3RhbmRhcmQiLCJlIjoxMzg1MDg5OTQyOTA1fQ";
	var server = "http://sandbox.feedly.com";
	var client_id = "sandbox", client_secret = "Z5ZSFRASVWCV3EFATRUY";
	var redirectURI = "http://localhost";

	
	beforeEach(function(done) {
		feedly = new FeedlyAPI(authCode, authToken, server, client_id, client_secret, redirectURI);
		done();
	});
	
	afterEach(function() {
		//cleanup
	});
	
	it("Verify feedly API object successfully created", function(){
			expect(feedly).toBeDefined();
			expect(feedly).toEqual(jasmine.any(FeedlyAPI));

	});
	
	describe("the authentication methods", function() {

		if(authToken == 'undefined') {
			
			it("should support auth token getters & setters", function() {
				var token = "1234abcd", refreshToken = "1234refresh";
				expect(feedly.getSavedAuthToken()).not.toBeDefined();
				feedly.saveToken(token, refreshToken);
				expect(feedly.getSavedAuthToken()).toBe(token);
				expect(feedly.getSavedRefreshToken()).toBe(refreshToken);
			});
		
		
			it("should use the authCode to get an authToken from feedly", function() {
				expect(feedly.getSavedAuthToken()).not.toBeDefined();
			
				runs(function() {
					feedly.getAuthToken();
				});
			
				waitsFor(function() {
					return feedly.getSavedAuthToken() != 'undefined';
				}, "The token should be defined", 750);
			});
		
			it("should use its refresh token to request a new auth token", function() {
				
				runs(function() {
					feedly.getAuthToken();
					feedly.refreshAuthToken();
				});	
				
				waitsFor(function() {
					return feedly.getSavedRefreshToken() == null;
				}, "The refresh_token should be set to null ", 750);
			
				runs(function() {
					expect(feedly.getSavedAuthToken()).not.toBeNull();
				});	
			});
		}
		
	});
	
	describe("the feeds methods", function() {
		
		it("should deliver JSON data about specific feed", function() {
			var feedID = "feed/http://feeds.engadget.com/weblogsinc/engadget";
			var feedInfo = null;
			
			runs(function() {
				feedly.getFeedInfo(feedID, function(returnedInfo) { 
					feedInfo = returnedInfo;
				});
			});
			
			waitsFor(function() {
				return feedInfo != null;
			}, "feed info to be returned", 750);
		
			runs(function() {
				expect(feedInfo).toBeDefined();
				expect(feedInfo).not.toBeNull();
				expect(feedInfo).not.toEqual("null")
							
				expect(feedInfo.id).toBeDefined();
				expect(feedInfo.velocity).toBeDefined();
				expect(feedInfo.title).not.toBe(null);
				expect(feedInfo.website).toBeDefined();
				expect(feedInfo.subscribers).toBeGreaterThan(0);
			});
		});	
	});
	
/*	describe("the Entity methods - a specific entry from a feed", function() {
		it("should deliver the JSON content for a specific entry", function() {
			var entryID = "gRtwnDeqCDpZ42bXE9Sp7dNhm4R6NsipqFVbXn2XpDA=_13fb9d6f274:2ac9c5:f5718180";
			var entry = null;
			
			runs(function() {
				feedly.getEntry(entryID, function(returnedInfo) { entry = returnedInfo});
			})
			
			waitsFor(function() {
				return entry != null;
			}, "entry info should be returned", 750);
			
			
			runs(function() {
				expect(entry.unread).toBeTruthy();
				expect(entry.tags.length).toBeGreaterThan(0);
				expect(entry.keywords.length).toBeGreaterThan(0);
				expect(entry.author).not.toBe(null);
				expect(entry.engagement).toBeDefined();
				expect(entry.title).toBeDefined();	
			});
			
		}); 
	});  */
	
/*	describe("the user methods", function() {
		
		//TODO Charles - add the userId
		it("should deliver json user profile data", function() {
			var userInfo = null, userId = '';
			
			runs(function() {
				feedly.getUserProfile(userId, function(returnedInfo) { userInfo = returnedInfo});
			});
			
			waitsFor(function() {
				return userInfo != null;
			}, " userInfo should not be null", 750);
			
			runs(function() {
				expect(userInfo.email).toBeDefined();
				expect(userInfo.locale).toBeDefined();
				expect(userInfo.givenName).toBeDefined();
				expect(userInfo.familyName).toBeDefined();
				expect(userInfo.gender).toBeDefined();
			});
			
		});
		
		//TODO Charles - add the userId
		it("should deliver json user subscriptions", function() {
			var subscriptions = null, userId = '';
			
			runs(function() {
				feedly.getUserSubscriptions(userId, function(returnedInfo) { subsciptions = returnedInfo});
			});
			
			waitsFor(function() {
				return subscriptions != null;
			}, " subscriptions should not be null", 750);
			
			runs(function() {
				expect(subscriptions.length).toBeGreaterThan(0);
				expect(subscriptions[0].title).toBeDefined();
				expect(subscriptions[0].categories.length).toBeGreaterThan(0);
			});
		});
		
		
		it("should deliver user's subscription categories", function() {
			var categories = null, userId = '';
			
			runs(function() {
				feedly.getUserCategories(userId, function(returnedInfo) { categories = returnedInfo});
			});
						
			waitsFor(function() {
			return categories != null;	
			}, "categories should not be null", 750);
			
			runs(function() {
				expect(categories.length).toBeGreaterThan(0);
				
				//TODO Charles - add more expectations as appropriate
			});
		}); 
	}); */
	
	
})
