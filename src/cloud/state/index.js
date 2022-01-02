/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

export const dirtyKey = (object, key) => {
  const dirtyKeys = object.dirtyKeys();
  if (!dirtyKeys.find((d) => d === key)) {
    return false;
  }

  return true;
};

export const dirtyKeys = (object, keys) => {
  const dirtyKeys = object.dirtyKeys();
  if (dirtyKeys.length !== keys.length) {
    return false;
  }

  keys.forEach((k) => {
    if (!dirtyKeys.find((d) => d === k)) {
      return false;
    }
  });

  return true;
};