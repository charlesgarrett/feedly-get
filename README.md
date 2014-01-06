feedly-get
==========


## Simple, read-only access to the Feedly Cloud API

Feedly-get is a module that provides convenience methods for read-only access to the Feedly Cloud API.  All methods return JSON objects and currently support the non-PRO queries to most of the entities in Feedly Cloud API including Feeds, Entries, Streams, Mixes, Search, Profile, Subscriptions, Categories, and Tags. 

I'm building an app that uses the Feedly Cloud API and the requirements of my app drove the features I added to this module. I will add more features as my application evolves.  


=====
#### NOTE
Because Feedly's authentication framework is completely outsourced to the OAuth implementation of other apps (currently Twitter, Google, and WordPress) you'll need to use a web browser to manually log into Feedly then copy the auth code (from the redirect URI) and include it in the instantiation of your feedly-get object.

For example, 

1. Get an authorization code from the feedly cloud [Reference http://developer.feedly.com/v3/auth/ ]


2. Interact with the browser and login using your Twitter, WordPress, or Google account. 


3. Grab the code from the redirect URI

  code=AQAAN3B7InUiOiIxMTQxNjQ2ODcyMDUzMTE5NzM1NzgiLCJpIjoiNGQ3MjQ3ODctMDNmOC00MGRiLTg0YWEtN2RkNWU4MjFiMjRlIiwicCI6NiwiYSI   6IkZlZWRseSBzYW5kYm94IGNsaWVudCIsInQiOjEzODc5OTA3NjYwODN9&state=

4. Use this code when instantiating your feedly-get object.

  var feedly = new FeedlyGet(code, "http-colon-wack-wack-sandbox.feedly.com", "sandbox", "${clientSecret}", "${redirectURI}")


5. When you call the init method, feedly-get will exchange your authentication code for an oauth authentication token.
   
  feedly.init()

6. Now you can start using the Feedly-get methods which require authentication. 

  var streamId = "vSbjObuspiUUUlHx496XW/WaRBw2NaRdTW1NAiwoLAs=_1431c635828:bf50:7cda226";

  var entryIds = feedly.getStreamEntryIds(streamId);
  
  entryIds.then(function(result)console.log(result)); // prints {"ids":[...]}
 

####See tests/feedly-spec.js for more usage examples.

