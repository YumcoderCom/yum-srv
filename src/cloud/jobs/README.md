# Define a Job
 ```
 Parse.Cloud.job("myJob", (request) =>  {
      // params: passed in the job call
      // headers: from the request that triggered the job
      // log: the ParseServer logger passed in the request
      // message: a function to update the status message of the job object
      const { params, headers, log, message } = request;
      message("I just started");
      return doSomethingVeryLong(request);
    });
```
return promise example: 
```
 Parse.Cloud.job("myJob", async (request, response) => {
  // params: passed in the job call
  // headers: from the request that triggered the job
  // log: the ParseServer logger passed in the request
  // message: a function to update the status message of the job object
  const { params, headers, log, message } = request;
  message("start job....");
  // console.log('llll', log)
  log.verbose('--omid verbose--', request);
  log.debug('--omid debug--', request);
  log.silly('--omid silly--', request);
  const promises = [1, 2].map(async (image) => {
    request.message('Doing ' + image);
    const contents = await Parse.Cloud.httpRequest({
      url: 'https://www.google.com/'
    });
    request.message('Got google' + image);
  });
  await Promise.all(promises);
});
```