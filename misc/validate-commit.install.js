#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var hookInputPath = 'misc/validate-commit.js';
var hookOutputPath = '.git/hooks/commit-msg';

if (!fs.existsSync(hookOutputPath)) {
  fs.writeFileSync(hookOutputPath, fs.readFileSync(hookInputPath));
  fs.chmodSync(hookOutputPath, '0755');
}