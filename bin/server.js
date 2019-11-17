#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path')
const config = require('../src/config')

;(async function main() {
  /**
   * Register all endpoints.
   */
  Object.keys(config.exchange.account.queue).forEach(endpoint => {
    spawn('node', [path.join(__dirname, '..', 'src', 'setup', 'registerEndpoint.js'), endpoint], {
      stdio: 'inherit'
    })
  })
})()
