/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { getCache } from "../cache/index.js";

export const getAdminUser = async () => {
  let adminUser = getCache().get("admin-user");
  if (!adminUser) {
    adminUser = await new Parse.Query(Parse.User)
      .equalTo("username", "Admin")
      .first({ useMasterKey: true });
    getCache().put("admin-user", adminUser);
  }
  return adminUser;
};

export const getRoleUsers = async (role, ttl = 30 * 60 * 1000) => {
  const roleName = `role-${role}Users`;
  let users = getCache().get(roleName);
  if (!users) {
    const roleObject = await new Parse.Query(Parse.Role)
      .equalTo("name", role)
      .first({ useMasterKey: true });
    // console.log("getRoleUsers-->", role, roleObject);
    users = await roleObject
      .getUsers()
      .query()
      .find({ useMasterKey: true });

    getCache().put(roleName, users, ttl);
  }
  return users;
};

export const userHasRole = async (user, role, ttl = 30 * 60 * 1000) => {
  const name = user.id + "_has_" + role;
  let v = getCache().get(name);
  if (v) {
    return v;
  }

  const reply = await new Parse.Query(Parse.Role)
    .equalTo("name", role)
    .equalTo("users", user)
    .first({ useMasterKey: true });

  const res = reply !== undefined;
  getCache().put(name, res, ttl);
  return res;
};

export const getRole = async (role) => {
  const name = `role-${role}`;
  let v = getCache().get(name);
  if (v) {
    return v;
  }

  const reply = await new Parse.Query(Parse.Role)
    .equalTo("name", role)
    .first({ useMasterKey: true });

  return reply;
};
