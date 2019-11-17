#!/usr/bin/env node

const uuid = require('uuid/v4')
const amqp = require('amqplib')
const config = require('../src/config')

;(async function main() {
  try {
    /**
     * Get CLI args
     */
    const args = process.argv.slice(2)

    if (args.length !== 2) {
      console.error('Usage: node ./client.js <endpoint> <payload>')
      process.exit(1)
    }
    
    /**
     * Emit to which queue?
     */
    const endpoint = config.exchange.account.queue[args[0]]

    /**
     * Get payload from CLI.
     */
    const payload = args[1];

    /**
     * Establish a connection to RabbitMQ server.
     */
    const connection = await amqp.connect('amqp://localhost')

    /**
     * Create a new channel to handle messages.
     */
    const channel = await connection.createChannel()

    /**
     * Register a new exchange. 
     * In case the exchange was already established, 
     * nothing happens.
     */
    await channel.assertExchange(config.exchange.account.id, 'direct', {
      /**
       * Do not forget queues and messages when RabbitMQ dies.
       */
      durable: true
    })

    /**
     * Register a fresh, empty callback queue whenever we connect to RabbitMQ.
     */
    const callbackQ = await channel.assertQueue('', {
      /**
       * Delete the queue when connection closes.
       */
      exclusive: true
    })

    /**
     * Consume the response.
     */
    const correlationId = uuid()
    channel.consume(callbackQ.queue, ret => {
      if (ret.properties.correlationId == correlationId) {
        console.log(' [.] Got: %s', ret.content.toString());

        /**
         * Close the connection.
         */
        setTimeout(() => { 
          connection.close(); 
          process.exit(0) 
        }, 500);
      }
    }, {
      noAck: true
    })

    /**
     * Send payload to endpoint for execution.
     */
    channel.publish(config.exchange.account.id, endpoint, Buffer.from(payload), {
      persistent: true,
      correlationId,
      replyTo: callbackQ.queue
    });
    console.log(" [+] Sent payload %s to endpoint %s", payload, endpoint);

  } catch (e) {
    console.error(e)
  }
})()
