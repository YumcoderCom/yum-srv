/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export const INVALID_PARAMS = () => new Error("20002");
export const RATE_LIMIT = (timeout) => {
  if (timeout) {
    return new Error(`20003_${timeout}`);
  }
  return new Error("20003");
};
export const USER_BLOCKED = () => new Error("20004");
export const INVALID_REQUEST = () => new Error("20005");
export const BANNED_USER = () => new Error("20006");
