/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { InMemoryCache } from "parse-server/lib/Adapters/Cache/InMemoryCache";

export const defaultTTL = 12 * 60 * 60 * 1000;

let cache = new InMemoryCache({ ttl: defaultTTL });

export const resetCache = () => {
  cache.clear();
};

export const getCache = () => {
  return cache;
};
