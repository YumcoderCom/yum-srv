/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import Trans from "../trans/index.js";

export default async (request) => {
  const trans = new Trans();
  try {
    const objects = await new Parse.Query("MyObject2").find();

    objects.forEach((o) => {
      o.increment("f", 10);
      trans.add(o);
    });

    const object = new Parse.Object("MyObject3");
    object.increment("f", 10);
    object.set("a", 10);
    trans.add(object);

    objects[0].set("ob", object);
    trans.add(objects[0]);

    const res = await trans.exec();
    console.log("-->", res);
  } catch (err) {
    console.error("err -->", err);
    return false;
  }

  return true;
};
