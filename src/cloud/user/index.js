/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { getCache } from "../cache/index.js";

export const getUser = async (objectId) => {
  const name = `user-${objectId}`;
  let v = getCache().get(name);
  if (v) {
    return v;
  }

  const reply = await new Parse.Query(Parse.User).get(objectId, {useMasterKey: true});

  return reply;
};
