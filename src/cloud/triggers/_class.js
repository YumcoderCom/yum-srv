/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 * 
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

Parse.Schema.all()
  .then(res => {
    // add trigger
    res.forEach(collection => {
      const collectionName = collection.className;
      const isSystemCollection =
        collectionName.startsWith("_") ||
        collectionName.startsWith("t__") ||
        collectionName.startsWith("yum__");
      if (!isSystemCollection) {
        console.log("Add class trigger: ", collectionName);
      }
    });
  })
  .catch(err => {
    console.log("Class trigger err: ", err);
  });

// todo add collection business logic here (beforeSave, afterSave ,..)
