/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 * 
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

const jobScheduler = Parse.JobScheduler.scheduler;

// Recreates all crons when the server is launched
jobScheduler.recreateScheduleForAllJobs();

// Recreates schedule when a job schedule has changed
Parse.Cloud.afterSave("_JobSchedule", request => {
  if (request.original){
    jobScheduler.destroyJob(request.original);
  }
  jobScheduler.createJob(request.object);
});

// Destroy schedule for removed job
Parse.Cloud.afterDelete("_JobSchedule", request => {
  jobScheduler.destroyJob(request.object);
});

// run parse job worker
Parse.JobScheduler.worker.run();