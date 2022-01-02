/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { INVALID_REQUEST } from "../err/index.js";

Parse.Cloud.beforeDelete(Parse.Role, async (request) => {
  const { object } = request;
  // 2 lock state
  if (object.get("state") > 0) {
    throw INVALID_REQUEST();
  }
});
