const config = require('../config')

/**
 * Register each handler to endpoint.
 */
module.exports = {
  [config.exchange.account.queue.balance]: async _ => _,
  [config.exchange.account.queue.create]: async _ => _,
  [config.exchange.account.queue.delete]: async _ => _,
  [config.exchange.account.queue.deposit]: async _ => _,
  [config.exchange.account.queue.withdrawal]: async _ => _,
}
