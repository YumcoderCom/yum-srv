import express from 'express';
import { ParseServer } from 'parse-server';
// import { createTerminus } from '@godaddy/terminus';
import { ParseJobScheduler, ParseJobWorker } from './parse-job-scheduler/index.js';
import emailAdapter from './email/index.js';
import ParseDashboard from 'parse-dashboard';
import { createServer } from 'http';
import cloudCode from './cloud/main.js';
import dotenv from 'dotenv';
// import cors from 'cors';
import path from 'path';

// import dayjs from 'dayjs'
// import jalaliday from 'jalaliday'
// import FSFilesAdapter from '@parse/fs-files-adapter';
// // import analyticsAdapter from './analytics';
// dayjs.extend(jalaliday)

const app = express();
dotenv.config(); // Loads environment variables from .env file

const init = () => {
  const redisConn = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  };

  const addJobScheduler = () => {
    const opts = { connection: redisConn, JOB_QUEUE_NAME: process.env.JOB_QUEUE_NAME };
    Parse.JobScheduler = {
      scheduler: new ParseJobScheduler(opts),
      worker: new ParseJobWorker(opts),
    };
    Parse.JobScheduler.worker.run();
  };

  addJobScheduler(); // Parse job scheduler

  // addParseRedisCache
  // Parse.appCache = new Redis({ ...redisConn, keyPrefix: 'cache:' });
}

// const gracefullyShutdown = () => {
//   const onSignal = () => {
//     console.log('server is starting cleanup');
//     // start cleanup of resource, like databases or file descriptors
//     console.log('stopping parse jobScheduler...');
//     Parse.JobScheduler.scheduler.close();
//     console.log('stopping parse jobWorkers...');
//     Parse.JobScheduler.worker.close();
//     process.exit();
//   };
//   const onHealthCheck = async () => {
//     // checks if the system is healthy, like the db connection is live
//     // resolves, if health, rejects if not
//   };
//   createTerminus(app, {
//     signal: 'SIGINT',
//     healthChecks: { '/health-check': onHealthCheck },
//     onSignal,
//   });
// }

const configYumServer = () => {
  const api = new ParseServer({
    // allowOrigin: "*",
    databaseURI: process.env.PARSE_SERVER_DATABASE_URI, // Connection string for your MongoDB database

    cloud: cloudCode,

    appId: process.env.PARSE_APP_ID,
    masterKey: process.env.PARSE_MASTER_KEY, // Keep this key secret!
    fileKey: process.env.PARSE_FILE_KEY,
    serverURL: process.env.PARSE_SERVER_URL, // Don't forget to change to https if needed
    publicServerURL: process.env.PARSE_SERVER_URL,
    //javascriptKey: process.env.PARSE_JAVASCRIPT_KEY,
    // clientKey: process.env.PARSE_CLIENT_KEY,
    //restAPIKey: process.env.PARSE_REST_KEY,
    //dotNetKey: process.env.PARSE_DOTNET_KEY,

    liveQuery: {
      classNames: (process.env.PARSE_LIVE_QUERY || '').split(','),
      redisURL: 'redis://' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT,
    },
    idempotencyOptions: {
      paths: ['.*'],       // enforce for all requests
      ttl: 300             // keep request IDs for 300s
    },
    appName: process.env.APP_NAME,
    // Enable email verification
    verifyUserEmails: false,
    enableAnonymousUsers: false,
    allowClientClassCreation: false,
    /* The TTL for caching the schema for optimizing read/write operations. You should put a long TTL when your DB is in production. default to 5000; set 0 to disable.
    :DEFAULT: 5000 */
    schemaCacheTTL: 720000, // 12*60*1000
    //     if `emailVerifyTokenValidityDuration` is `undefined` then
    //        email verify token never expires
    //     else
    //        email verify token expires after `emailVerifyTokenValidityDuration`
    //
    // `emailVerifyTokenValidityDuration` defaults to `undefined`
    //
    // email verify token below expires in 2 hours (= 2 * 60 * 60 == 7200 seconds)
    emailVerifyTokenValidityDuration: 24 * 60 * 60, // in seconds (2 hours = 7200 seconds)
    preventLoginWithUnverifiedEmail: false,
    emailAdapter: emailAdapter({
      from: process.env.SUPPORT_EMAIL,
    }),
  });

  app.use(process.env.SERVER_PATH, api);
}

const configYumDashboard = () => {
  var options = { allowInsecureHTTP: true };
  var dashboard = new ParseDashboard(
    {
      apps: [
        {
          serverURL: process.env.PARSE_SERVER_URL,
          appId: process.env.PARSE_APP_ID,
          masterKey: process.env.PARSE_MASTER_KEY,
          appName: process.env.APP_NAME,
        },
      ],
      users: [
        {
          user: process.env.DASHBOARD_ADMIN,
          pass: process.env.DASHBOARD_PASS,
        },
      ],
    },
    options
  );


  app.use(process.env.DASHBOARD_PATH, dashboard);
}

const listen = () => {
  let httpServer = createServer(app);
  httpServer.listen(process.env.PARSE_PORT, () => console.log(`Yumcoder-server running on port ${process.env.PARSE_PORT}.`));
  // var parseLiveQueryServer =
  ParseServer.createLiveQueryServer(httpServer, {
    redisURL: 'redis://' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT,
  });
}

const run = () => {
  init();
  //gracefullyShutdown();
  configYumServer();
  configYumDashboard();

  let __dirname = path.resolve(path.dirname(''));
  app.use(express.static(path.join(__dirname, 'src/web')));
  // app.get('/', function (req, res) {
  //   res.sendFile(path.join(__dirname, 'src/web/index.html'));
  // });
  listen();
}

// TODO improve code syntax
run();