/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import ParseRestRequest from "parse-server/lib/request";

const transaction = (requests) => {
  return ParseRestRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Parse-Application-Id": process.env.PARSE_APP_ID,
      "X-Parse-Master-Key": process.env.PARSE_MASTER_KEY,
    },
    url: process.env.PARSE_SERVER_URL + "/batch",
    body: JSON.stringify({
      requests,
      transaction: true,
    }),
  });
};

export default class Trans {
  constructor() {
    this.requests = [];
  }

  add(object) {
    // https://github.com/parse-community/Parse-SDK-JS/blob/d43225955f1f3bbce25eb7d06ea6e29369221769/src/ParseObject.js#L313
    //
    // return:
    // {
    //   method,
    //   body,
    //   path
    // }
    const req = object._getSaveParams();
    req.path = process.env.SERVER_PATH + "/" + req.path;
    this.requests.push(req);
  }

  exec() {
    return transaction(this.requests);
  }

  merge(trans) {
    this.requests.push(...trans.requests);
  }
}
