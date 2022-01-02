# Implementing validation
```
Parse.Cloud.beforeSave("Review", request => {
  if (request.object.get("stars") < 1) {
    throw "you cannot give less than one star";
  }

  if (request.object.get("stars") > 5) {
    throw "you cannot give more than five stars";
  }
});
```
# Modifying Objects on Save
```
Parse.Cloud.beforeSave("Review", request => {
  const comment = request.object.get("comment");
  if (comment.length > 140) {
    // Truncate and add a ...
    request.object.set("comment", comment.substring(0, 137) + "...");
  }
});
```

# Predefined Classes, e.g. Parse.User
you should not pass a String for the first argument. Instead, you should pass the class itself, for example:
```
Parse.Cloud.beforeSave(Parse.User, async request => {
  // code here
});
```
# afterSave Triggers
n some cases, you may want to perform some action, such as a push, after an object has been saved. You can do this by registering a handler with the afterSave method. For example, suppose you want to keep track of the number of comments on a blog post. You can do that by writing a function like this:

# Async Behavior
In the example above, the client will receive a successful response before the promise in the handler completes, regardless of how the promise resolves. For instance, the client will receive a successful response even if the handler throws an exception. Any errors that occurred while running the handler can be found in the Cloud Code log.

You can use an afterSave handler to perform lengthy operations after sending a response back to the client. In order to respond to the client before the afterSave handler completes, your handler may not return a promise and your afterSave handler may not use async/await.

# Using Request Context
State can be passed from a beforeSave handler to an afterSave handler in the Request Context. The following example sends emails to users who are being added to a Parse.Role’s users relation asynchronously, so the client receives a response before the emails complete sending:

```
Parse.Cloud.afterSave("Comment", request => {
  const query = new Parse.Query("Post");
  query
    .get(request.object.get("post").id)
    .then(function(post) {
      post.increment("comments");
      return post.save();
    })
    .catch(function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    });
});
```

```
const beforeSave = function beforeSave(request) {
  const { object: role } = request;
  // Get users that will be added to the users relation.
  const usersOp = role.op('users');
  if (usersOp && usersOp.relationsToAdd.length > 0) {
    // add the users being added to the request context
    request.context = { buyers: usersOp.relationsToAdd };
  }
};

const afterSave = function afterSave(request) {
  const { object: role, context } = request;
  if (context && context.buyers) {
    const purchasedItem = getItemFromRole(role);
    const promises = context.buyers.map(emailBuyer.bind(null, purchasedItem));
    item.increment('orderCount', context.buyers.length);
    promises.push(item.save(null, { useMasterKey: true }));
    Promise.all(promises).catch(request.log.error.bind(request.log));
  }
};
```

# Predefined Classes
If you want to use afterSave for a predefined class in the Parse JavaScript SDK (e.g. Parse.User), you should not pass a String for the first argument. Instead, you should pass the class itself, for example:
```
Parse.Cloud.afterSave(Parse.User, async (request) => {
    // code here
})
```
# beforeDelete Triggers
You can run custom Cloud Code before an object is deleted. You can do this with the beforeDelete method. For instance, this can be used to implement a restricted delete policy that is more sophisticated than what can be expressed through ACLs. For example, suppose you have a photo album app, where many photos are associated with each album, and you want to prevent the user from deleting an album if it still has a photo in it. You can do that by writing a function like this:
```
Parse.Cloud.beforeDelete("Album", (request) => {
  const query = new Parse.Query("Photo");
  query.equalTo("album", request.object);
  query.count()
    .then((count) => {
      if (count > 0) {
        throw "Can't delete album if it still has photos.";
    })
    .catch((error) {
      throw "Error " + error.code + " : " + error.message + " when getting photo count.";
    });
});
```
If the function throws, the Album object will not be deleted, and the client will get an error. Otherwise,the object will be deleted normally.

# Predefined Classes
If you want to use beforeDelete for a predefined class in the Parse JavaScript SDK (e.g. Parse.User), you should not pass a String for the first argument. Instead, you should pass the class itself, for example:
```
Parse.Cloud.beforeDelete(Parse.User, async (request) => {
    // code here
})
```
# afterDelete Triggers
In some cases, you may want to perform some action, such as a push, after an object has been deleted. You can do this by registering a handler with the afterDelete method. For example, suppose that after deleting a blog post, you also want to delete all associated comments. You can do that by writing a function like this:
```
Parse.Cloud.afterDelete("Post", (request) => {
  const query = new Parse.Query("Comment");
  query.equalTo("post", request.object);
  query.find()
    .then(Parse.Object.destroyAll)
    .catch((error) => {
      console.error("Error finding related comments " + error.code + ": " + error.message);
    });
});
```
The afterDelete handler can access the object that was deleted through request.object. This object is fully fetched, but cannot be refetched or resaved.

The client will receive a successful response to the delete request after the handler terminates, regardless of how the afterDelete terminates. For instance, the client will receive a successful response even if the handler throws an exception. Any errors that occurred while running the handler can be found in the Cloud Code log.

# Predefined Classes
If you want to use afterDelete for a predefined class in the Parse JavaScript SDK (e.g. Parse.User), you should not pass a String for the first argument. Instead, you should pass the class itself, for example:
```
Parse.Cloud.afterDelete(Parse.User, async (request) => {
    // code here
})
```
# beforeFind Triggers
Available only on parse-server cloud code starting 2.2.20

In some cases you may want to transform an incoming query, adding an additional limit or increasing the default limit, adding extra includes or restrict the results to a subset of keys. You can do so with the beforeFind trigger.

Examples
```
// Properties available
Parse.Cloud.beforeFind('MyObject', (req) => {
  let query = req.query; // the Parse.Query
  let user = req.user; // the user
  let triggerName = req.triggerName; // beforeFind
  let isMaster = req.master; // if the query is run with masterKey
  let isCount = req.count; // if the query is a count operation (available on parse-server 2.4.0 or up)
  let logger = req.log; // the logger
  let installationId = req.installationId; // The installationId
});

// Selecting keys
Parse.Cloud.beforeFind('MyObject', (req) => {
  let query = req.query; // the Parse.Query
  // Force the selection on some keys
  query.select(['key1', 'key2']);
});

// Asynchronous support
Parse.Cloud.beforeFind('MyObject', (req) => {
  let query = req.query;
  return aPromise().then((results) => {
    // do something with the results
    query.containedIn('key', results);
  });
});

// Returning a different query
Parse.Cloud.beforeFind('MyObject', (req) => {
  let query = req.query;
  let otherQuery = new Parse.Query('MyObject');
  otherQuery.equalTo('key', 'value');
  return Parse.Query.or(query, otherQuery);
});

// Rejecting a query
Parse.Cloud.beforeFind('MyObject', (req) =>  {
  // throw an error
  throw new Parse.Error(101, 'error');

  // rejecting promise
  return Promise.reject('error');
});

// Setting the read preference for a query
// -- as of Parse Server 2.5, Mongo Only
Parse.Cloud.beforeFind('MyObject2', (req) => {
  req.readPreference = 'SECONDARY_PREFERRED';
  req.subqueryReadPreference = 'SECONDARY';
  req.includeReadPreference = 'PRIMARY';
});
```

# Predefined Classes
If you want to use beforeFind for a predefined class in the Parse JavaScript SDK (e.g. Parse.User), you should not pass a String for the first argument. Instead, you should pass the class itself, for example:
```
Parse.Cloud.beforeFind(Parse.User, async (request) => {
    // code here
})
```

# afterFind Triggers
Available only on parse-server cloud code starting 2.2.25

In some cases you may want to manipulate the results of a query before they are sent to the client. You can do so with the afterFind trigger.
```
Parse.Cloud.afterFind('MyCustomClass', async (request) => {
    // code here
})
```
# Predefined Classes
If you want to use afterFind for a predefined class in the Parse JavaScript SDK (e.g. Parse.User), you should not pass a String for the first argument. Instead, you should pass the class itself, for example:
```
Parse.Cloud.afterFind(Parse.User, async (request) => {
    // code here
})
```
# beforeLogin Triggers
Available only on parse-server cloud code starting 3.3.0

Sometimes you may want to run custom validation on a login request. The beforeLogin trigger can be used for blocking an account from logging in (for example, if they are banned), recording a login event for analytics, notifying user by email if a login occurred at an unusual IP address and more.
```
Parse.Cloud.beforeLogin(async request => {
  const { object: user }  = request;
  if(user.get('isBanned')) {
   throw new Error('Access denied, you have been banned.')
  }
});
```

# afterLogout Triggers
Available only on parse-server cloud code starting 3.10.0

Sometimes you may want to run actions after a user logs out. For example, the afterLogout trigger can be used for clean-up actions after a user logs out. The triggers contains the session object that has been deleted on logout. From this session object you can determine the user who logged out to perform user-specific tasks.
```
Parse.Cloud.afterLogout(async request => {
  const { object: session }  = request;
  const user = session.get('user');
  user.set('isOnline', false);
  user.save(null,{useMasterKey:true});
});
```