"use strict";

const readdirp = require("readdirp");

/**
 * Compatibility wrapper for readdirp v5.
 * Restores the .promise() API removed in v4+ by collecting the async iterable into an array.
 */
readdirp.promise = async function (root, options) {
  const entries = [];
  for await (const entry of readdirp(root, options)) {
    entries.push(entry);
  }
  return entries;
};

module.exports = readdirp;
