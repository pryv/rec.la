#! /usr/bin/env node
const updateAndLoad = require('../nodejs-hook/check').updateAndLoad;

updateAndLoad((err, res) => {
  if (err) console.error(err);
});