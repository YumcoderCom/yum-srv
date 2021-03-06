import hbs from "handlebars";
import fs from "fs";

export const parser = (templatePath, data) => {
  return new Promise((resolve, reject) => {
    fs.readFile(templatePath, "utf-8", (error, buffer) => {
      if (error) {
        reject(error);
      } else {
        const template = hbs.compile(buffer);
        resolve(template(data));
      }
    });
  });
};

// module.exports = parser;
