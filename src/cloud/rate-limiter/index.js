/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { RATE_LIMIT } from "../err/index.js";

export default async (key, limit, timeout) => {
  var t = Math.floor(+new Date() / (timeout * 1000));
  var rlKey = `rl:${key}:${t}`;
  const res = await Parse.appCache
    .multi()
    .incr(rlKey)
    .expire(rlKey, timeout)
    .exec();

  const current = res[0][1];
  if (current === limit) {
    throw RATE_LIMIT();
  }

  return current;
};
