describe("Behavior contract for the feedly API controller", function() {
	"use strict";
	
 	var feedly, FeedlyAPI = require('../api/feedly').FeedlyAPI;
var querystring = require("querystring");

	var authCode = "AQAAKa57ImkiOiJjNzAxYTJhYi1lMWY0LTRlZGQtYWVhZC04MjQ1ZjQ1MDhhNWMiLCJ1IjoiMTExNDM5NDEyNDI2MDU1NzgzMzU0IiwicCI6NiwiYSI6IkZlZWRseSBzYW5kYm94IGNsaWVudCIsInQiOjEzODU5Mjk3OTg3MjB9";
	var authToken = 'AQAAzdB7ImkiOiJjNzAxYTJhYi1lMWY0LTRlZGQtYWVhZC04MjQ1ZjQ1MDhhNWMiLCJwIjo2LCJhIjoiRmVlZGx5IHNhbmRib3ggY2xpZW50IiwidCI6MSwidiI6InNhbmRib3giLCJ4Ijoic3RhbmRhcmQiLCJlIjoxMzg2NTM0NjU4MzM4fQ:sandbox';
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
							
				expect(feedInfo.id).toBeDefined();
				expect(feedInfo.velocity).toBeDefined();
				expect(feedInfo.title).not.toBe(null);
				expect(feedInfo.website).toBeDefined();
				expect(feedInfo.subscribers).toBeGreaterThan(0);
			});
		});	
	});
	
	
	//Charles TODO - not working
/*	describe("the Entity methods - a specific entry from a feed", function() {
		it("should deliver the JSON content for a specific entry", function() {
			var entryID = "9bVktswTBLT3zSr0Oy09Gz8mJYLymYp71eEVeQryp2U=_13fb9d1263d:2a8ef5:db3da1a7";
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
	
	describe("the user methods", function() {
		
		it("should deliver json user profile data", function() {
			var userInfo = null;
			
			runs(function() {
				feedly.getUserProfile(function(returnedInfo) { userInfo = returnedInfo});
			});
			
			waitsFor(function() {
				return userInfo != null;
			}, " userInfo should not be null", 750);
			
			runs(function() {
				if(typeof userInfo.twitterUserId == "undefined") {
					expect(userInfo.email).toBeDefined();
					expect(userInfo.familyName).toBeDefined();
					expect(userInfo.givenName).toBeDefined();
				}
				else {
					expect(userInfo.twitter).toBeDefined();
					expect(userInfo.id).toBeDefined();
					expect(userInfo.client).toBeDefined();		
				}
			});
		});
		

		it("should deliver json user subscriptions", function() {
			var subs = null;
			
			runs(function() {
				feedly.getUserSubscriptions(function(returnedInfo) { subs = returnedInfo});
			});
			
			waitsFor(function() {
				return subs != null;
			}, " subscriptions should not be null", 750);
			
			runs(function() {
				if(typeof subs != "undefined") {
					expect(subs[0]).toBeDefined();
					expect(subs[0].title).toBeDefined();
					expect(subs[0].website).toBeDefined();
					expect(subs[0].topics).toBeDefined();
					expect(subs[0].velocity).toBeDefined();
					expect(subs[0].categories.length).toBeGreaterThan(0);
				}
			});
		}); 
		
			
		it("should deliver user's subscription categories", function() {
			var categories = null;
			
			runs(function() {
				feedly.getUserCategories(function(returnedInfo) { categories = returnedInfo});
			});
						
			waitsFor(function() {
			return categories != null;	
			}, "categories should not be null", 750);
			
			runs(function() {
				expect(categories.length).toBeGreaterThan(0);
				expect(categories[0].id).toBeDefined();
				expect(categories[0].label).toBeDefined();
				
			});
		});   
	}); 
	
	
})
