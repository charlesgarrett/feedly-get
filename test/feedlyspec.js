describe("Behavior contract for the feedly API controller", function() {
	"use strict";
	
 	var feedly, FeedlyAPI = require('../api/feedly').FeedlyAPI;
	var querystring = require("querystring");

	var authCode = "AQAA3m97InUiOiIxMTQxNjQ2ODcyMDUzMTE5NzM1NzgiLCJpIjoiNGQ3MjQ3ODctMDNmOC00MGRiLTg0YWEtN2RkNWU4MjFiMjRlIiwicCI6NiwiYSI6IkZlZWRseSBzYW5kYm94IGNsaWVudCIsInQiOjEzODc3NjI1OTIzODB9";
	var authToken = 'AQAAsfx7ImkiOiI0ZDcyNDc4Ny0wM2Y4LTQwZGItODRhYS03ZGQ1ZTgyMWIyNGUiLCJwIjo2LCJhIjoiRmVlZGx5IHNhbmRib3ggY2xpZW50IiwidCI6MSwidiI6InNhbmRib3giLCJ4Ijoic3RhbmRhcmQiLCJlIjoxMzg4MzY3NDEwNTYzfQ:sandbox';
	var server = "http://sandbox.feedly.com";
	var client_id = "sandbox", client_secret = "QNFQRFCFM1IQCJB367ON";
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
	
	//TODO - Priority - Streamline the authentication process - can I avoid using a browser?
	describe("the authentication methods", function() {

		if(authToken === 'undefined') {
			
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
	
	
	describe("the Stream-Entry methods ", function() {
		it("should deliver the JSON content for some entry", function() {
			var entryID = "vSbjObuspiUUUlHx496XW/WaRBw2NaRdTW1NAiwoLAs=_1431c635828:bf50:7cda226";
			var entry = null;
			
			runs(function() {
				feedly.getEntry(entryID, function(returnedInfo) { entry = returnedInfo});
			})
			
			waitsFor(function() {
				return entry != null;
			}, "entry info should be returned", 750);
			
			
			runs(function() {
				expect(entry[0].unread).toBeTruthy();
				expect(entry[0].author).toBeDefined();
				expect(entry[0].summary).toBeDefined();
				expect(entry[0].title).toBeDefined();	
			});
			
		}); 
		
		it("should deliver the entry IDs from a user's stream", function() {
			var streamId = "vSbjObuspiUUUlHx496XW/WaRBw2NaRdTW1NAiwoLAs=_1431c635828:bf50:7cda226";
			var id_list = null;
			
			runs(function() {
				feedly.getStreamEntryIds(streamId, function(returnedInfo) { id_list = returnedInfo});
			})
			
			waitsFor(function() {
				return id_list != null;
			}, "list of IDs should be returned", 750);
			
			
			runs(function() {
				expect(id_list.ids).toBeDefined();
			});
		});
		
		it("should deliver the entry contents from a user's stream", function() {
			var streamId = "feed/http://www.engadget.com/rss.xml";
			var contents = null;

			runs(function() {
				feedly.getStreamContents(streamId, function(returnedInfo) { contents = returnedInfo});
			})
			
			waitsFor(function() {
				return contents != null;
			}, "stream contents should be returned", 750);
			
			
			runs(function() {
				expect(contents.title).toBeDefined();
				expect(contents.continuation).toBeDefined();
				expect(contents.alternate).toBeDefined();
				expect(contents.items[0].unread).toBeTruthy();
				expect(contents.items[0].author).toBeDefined();
				expect(contents.items[0].summary).toBeDefined();
				expect(contents.items[0].title).toBeDefined();
			});
		});
		
		it("should deliver a mix of the most engaging content from a specific stream", function() {
			var streamId = "feed/http://www.engadget.com/rss.xml";
			var mix = null;
			
			runs(function() {
				feedly.getStreamMixContents(streamId, function(returnedInfo) { mix = returnedInfo});
			})
			
			waitsFor(function() {
				return mix != null;
			}, "engaging content should be returned", 750);
			
			runs(function() {
				expect(mix.title).toBeDefined();
				expect(mix.alternate).toBeDefined();
				expect(mix.items[0].unread).toBeTruthy();
				expect(mix.items[0].author).toBeDefined();
				expect(mix.items[0].summary).toBeDefined();
				expect(mix.items[0].title).toBeDefined();
			});
		});
		
	});  
	
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
				if(typeof subs[0] === "object") {
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
				if(categories.length > 0) {
					expect(categories.length).toBeGreaterThan(0);
					expect(categories[0].id).toBeDefined();
					expect(categories[0].label).toBeDefined();
				}
			});
		});   
		
		it("should return list of tags created by the user", function() {
			var tags = null;
			
			runs(function() {
				feedly.getUserTags(function(returnedInfo) { tags = returnedInfo});
			});
			
			waitsFor(function() {
				return tags != null;
			}, "tags should not be null", 750);
			
			runs(function() {
				if(tags.length > 0) {
					expect(tags[0].id).toBeDefined();
				}
			});
		});
		
	}); 
	
	describe("the search API methods", function() { 
		it("should return a list of feeds that match a keyword", function() {
			var feeds = null;
			var keyword = "apartment therapy";
			
			runs(function() {
				feedly.searchFeeds(keyword, function(returnedInfo) { feeds = returnedInfo});
			});
			
			waitsFor(function() {
				return feeds != null;
			}, "feeds should not be null", 750);
			
			runs(function() {
				expect(feeds.results).toBeDefined();
				expect(feeds.results[0].title).toBeDefined();
				expect(feeds.results[0].website).toBeDefined();
				expect(feeds.results[0].feedId).toBeDefined();
				expect(feeds.results[0].velocity).toBeDefined();
				expect(feeds.results[0].subscribers).toBeDefined();
				expect(feeds.results[0].curated).toBeTruthy();
				expect(feeds.results[0].description).toBeDefined();
				expect(feeds.results[0].lastUpdated).toBeDefined();
			});
		});
	});
});
