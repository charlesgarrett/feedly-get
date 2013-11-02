describe("Behavior contract for the feedly API controller", function() {
	"use strict";
	
 	var feedly, FeedlyAPI = require('../api/feedly').FeedlyAPI;

	var authCode = "AQAAIq17ImkiOiI2YWZlZDdmYS01YTU3LTRjOTYtYTEyYy00ZjJiMmIyODgxYTYiLCJ1IjoiMTM0MDM5NzQyNiIsImEiOiJGZWVkbHkgc2FuZGJveCBjbGllbnQiLCJwIjo0LCJ0IjoxMzgzMzUwNTM3NTc3fQ";
	var server = "http://sandbox.feedly.com";
	var client_id = "sandbox", client_secret = "Z5ZSFRASVWCV3EFATRUY";
	var redirectURI = "http://localhost";

	
	beforeEach(function(done) {
		feedly = new FeedlyAPI(authCode, server, client_id, client_secret, redirectURI);
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
		
	});
	
	describe("the feeds methods", function() {
		
		beforeEach(function(done) {
			expect(feedly.getSavedAuthToken()).not.toBeNull();
			done();
		});
		
		it("should deliver JSON data about on specific feed", function() {
			var feedID = "feed/http://www.theverge.com/rss/full.xml";
			
			
			var feedInfo = null;
			
			runs(function() {
				feedInfo = feedly.getFeedInfo(feedID);
			});
			
			waitsFor(function() {
				return feedInfo != null;
			}, "feed info to be returned", 750);
			
			runs(function() {
				expect(feedInfo).toBeDefined();
				expect(feedInfo).not.toBe(null);
				expect(feedInfo.length).toBeGreaterThan(0);
				expect(feedInfo[0].curated).toBeTruthy();
				expect(feedInfo[0].title).not.toBe(null);
				expect(feedInfo[0].keywords.length).toBeGreaterThan(0);
				expect(feedInfo[0].sponsored).toBeTruthy();
				expect(feedInfo[0].subscribers).toBeGreaterThan(0);
				done();
			});
		});	
	});
	
	describe("the Entity methods - a specific entry from a feed", function() {
		it("should deliver the JSON content for a specific entry", function() {
			var entryID = "gRtwnDeqCDpZ42bXE9Sp7dNhm4R6NsipqFVbXn2XpDA=_13fb9d6f274:2ac9c5:f5718180";
			var entry = feedly.getEntry(entryID);
			expect(entry).not.toBe(null);
			expect(entry.unread).toBeTruthy();
			expect(entry.tags.length).toBeGreaterThan(0);
			expect(entry.keywords.length).toBeGreaterThan(0);
			expect(entry.author).not.toBe(null);
			expect(entry.engagement).toBeDefined();
			expect(entry.title).toBeDefined();
		});
	});
	
	describe("the user methods", function() {
		it("should deliver json user profile data", function() {
			var userInfo = feedly.getUserProfile();
			expect(userInfo.email).toBeDefined();
			expect(userInfo.locale).toBeDefined();
			expect(userInfo.givenName).toBeDefined();
			expect(userInfo.familyName).toBeDefined();
			expect(userInfo.gender).toBeDefined();
		});
		
		it("should deliver json user subscriptions", function() {
			var subscriptions = feedly.getUserSubscriptions();
			expect(subscriptions).not.toBe(null);
			expect(subscriptions.length).toBeGreaterThan(0);
			
			expect(subscriptions[0].title).toBeDefined();
			expect(subscriptions[0].categories.length).toBeGreaterThan(0);
		});
		
		
		it("should deliver user's subscription categories", function() {
			var subscriptions = feedly.getUserSubscriptions();
			var categories = feedly.getCategories(subscriptions);
			
			expect(categories.length).toBeGreaterThan(0);
			
			feedly.setUserCategories(categories);
			expect(feedly.getUserCategories()).toBeDefined();
		});
	});
	
	
})
