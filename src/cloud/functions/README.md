
# Using the Master Key in cloud code
Set useMasterKey:true in the requests that require master key.

Examples:
```query.find({useMasterKey:true});
object.save(null,{useMasterKey:true});
Parse.Object.saveAll(objects,{useMasterKey:true});
```
Exmple for run query based on user token:
```
Parse.Cloud.define('getMessagesForUser', function(request, response) {
  var user = request.user; // request.user replaces Parse.User.current()
  var token = user.getSessionToken(); // get session token from request.user

  var query = new Parse.Query('Messages');
  query.equalTo('recipient', user);
  query.find({ sessionToken: token }) // pass the session token to find()
    .then(function(messages) {
      response.success(messages);
    });
});
```
exmple of simple response:
```
Parse.Cloud.define("hello", function(req, res) {
  // {
  //  "result": "Hi"
  // }
  return "Hi";
});
```

```
Parse.Cloud.define("helloErr", function(req, res) {
  // code ...
  // {
  //  "code": 141,
  //  "error": "you cannot give more than five stars"
  // }
  throw "you cannot give more than five stars";
});
```