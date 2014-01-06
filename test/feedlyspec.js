describe("Behavior contract for the feedly API controller", function() {
	"use strict";
	
 	var FeedlyAPI = require('../feedly').FeedlyAPI;
	var querystring = require("querystring");

	var authCode = "";
	var server = "http://sandbox.feedly.com";
	var client_id = "sandbox", client_secret = "";
	var redirectURI = "http://localhost";

	var feedly;

	beforeEach(function() {
		feedly = new FeedlyAPI(authCode, server, client_id, client_secret, redirectURI);
	});
	
	afterEach(function() {
		feedly = null;
	});

/*	describe("the authentication methods", function() {
		
		it("should use the authCode to get an authToken from feedly", function() {
				expect(feedly.getSavedAuthToken()).not.toBeDefined();
			
				var token = null;
				runs(function() {
					feedly.init()
					.then(function() {token = feedly.getSavedAuthToken()});
				});
				
				waitsFor(function() {
					token != null;
				}, "Auth token should be saved", 2000);
				
				runs(function() {
					expect(feedly.getSavedAuthToken()).toBeDefined();
				})
			});
		
	   it("should use its refresh token to request a new auth token", function() {
				
				var refreshToken = "dummyValue";
				runs(function() {
					feedly.init()
					.then(function() {return feedly.refreshAuthToken() })
					.then(function() { refreshToken = feedly.getSavedRefreshToken()})
				});	
				
				waitsFor(function() {
					refreshToken == null;
				}, "the refresh token to be null after it is used to get a new Auth token", 2000);
				
				runs(function() {
					var newToken = feedly.getSavedAuthToken();
					expect(newToken).toBeDefined();
					expect(newToken).not.toBeNull();
				});
		}); 
	
	}); */

	describe("the feeds methods", function() {
		
		it("should deliver JSON data about specific feed", function() {
			var feedID = "feed/http://feeds.engadget.com/weblogsinc/engadget";
			var feedInfo = null;
			
			runs(function() {
				feedly.getFeedInfo(feedID)
					.then(function(returnedInfo) { 
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
				feedly.getEntry(entryID)
					.then(function(returnedInfo) { entry = returnedInfo});
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
				feedly.init()
					.then(function() {return feedly.getStreamEntryIds(streamId)})
					.then(function(result) { id_list = result});
			})
			
			waitsFor(function() {
				return id_list != null;
			}, "list of IDs should be returned", 2000);
			
			
			runs(function() {
				expect(id_list.ids).toBeDefined();
			});
		});
			
		it("should deliver the entry contents from a user's stream", function() {
			var streamId = "feed/http://www.engadget.com/rss.xml";
			var contents = null;

			runs(function() {
				feedly.init()
					.then(function() {return feedly.getStreamContents(streamId)})
					.then(function(result) { contents = result});
			})
			
			waitsFor(function() {
				return contents != null;
			}, "stream contents should be returned", 2000);
			
			
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
				feedly.init()
				.then(function() {return feedly.getStreamMixContents(streamId)})
				.then(function(result) { mix = result});
			})
			
			waitsFor(function() {
				return mix != null;
			}, "engaging content should be returned", 2000);
			
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
				feedly.init()
					.then(function() {return feedly.getUserProfile()}, function(err) {console.log(err)})
					.then(function(result) {console.log('result '+result); userInfo = result});
			});
			
			waitsFor(function() {
				return userInfo != null;
			}, " user profile should not be null", 2000)
			
			runs(function(){
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
				feedly.init()
					.then(function() { return feedly.getUserSubscriptions()})
					.then(function(result) { subs = result});
			});
			
			waitsFor(function() {
				return subs != null;
			}, " subscriptions should not be null", 2000);
			
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
				feedly.init()
					.then(function() {return feedly.getUserCategories()} )
					.then(function(result) { categories = result} );
			});
						
			waitsFor(function() {
				return categories != null;	
			}, "categories should not be null", 2000);
			
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
				feedly.init()
					.then(function() {return feedly.getUserTags()})
					.then(function(result) { tags = result});
			});
			
			waitsFor(function() {
				return tags != null;
			}, "tags should not be null", 2000);
			
			runs(function() {
				if(tags.length > 0) {
					expect(tags[0].id).toBeDefined();
				}
			});
		});
		
		
	}); 
	
	describe("the search API methods", function() { 
		var feedly;

		beforeEach(function() {
			feedly = new FeedlyAPI(authCode, server, client_id, client_secret, redirectURI);
		});
		
		it("should return a list of feeds that match a keyword", function() {
			var feeds = null;
			var keyword = "apartment therapy";
			
			runs(function() {
				feedly.init()
					.then(function() {return feedly.searchFeeds(keyword)} )
					.then(function(result) { feeds = result}, function(err) {console.log(err)});
			});
			
			waitsFor(function() {
				return feeds != null;
			}, "feeds should not be null", 2000);
			
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
