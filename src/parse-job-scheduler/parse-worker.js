/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { Worker } from "bullmq";
import path from 'path';

export default class ParseJobWorker {
  constructor({ JOB_QUEUE_NAME, connection }) {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const Sandbox = __dirname + "/parse-job-sandbox.js";
    this.worker = new Worker(JOB_QUEUE_NAME, Sandbox, {
      connection,
      concurrency: 3,
      prefix: process.env.JOB_QUEUE_PREFIX
    });
  }

  // onCompleted(job, value){
  //   console.log("done parse_job:", job.data, value);
  // };
  // onFailed(jobId, err){
  //   console.error("error parse_job", jobId, "err", err);
  // };
  // onDrained (job){
  //   console.log("drained parse_job", job);
  // };

  async run() {
    // this.worker.on("completed", this.onCompleted);
    // this.worker.on("failed", this.onFailed);
    // this.worker.on("drain", this.onDrained);
    await this.worker.waitUntilReady();
  }

  async close() {
    if (this.worker) {
      await this.worker.close();
    }
  }
}
