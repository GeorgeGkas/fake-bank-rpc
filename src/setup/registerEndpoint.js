const amqp = require('amqplib');
const config = require('../config')
const routes = require('../routes')

;(async function registerEndpoint() {
  try {
    /**
     * Get CLI args
     */
    const endpoint = process.argv.slice(2)

    if (endpoint.length !== 1) {
      console.error('Usage: node ./registerEndpoint.js <endpoint>')
      process.exit(1)
    }

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
     * Create a fresh, empty queue whenever we connect to RabbitMQ.
     */
    const q = await channel.assertQueue('', {
      /**
       * Delete the queue when connection closes.
       */
      exclusive: true
    })

    /**
     * Bind exchange to queue for requested endpoint.
     */
    await channel.bindQueue(q.queue, config.exchange.account.id, config.exchange.account.queue[endpoint])

    /**
     * Split tasks evenly to workers.
     */
    await channel.prefetch(1);

    /**
     * Consume the task.
     */
    await channel.consume(q.queue, async req => {
      if (req.content) {
        console.log(" [+] Received payload %s on endpoint %s", req.content.toString(), req.fields.routingKey);
      
        /**
         * Execute the handler and get the result.
         */
        const ret = await routes[req.fields.routingKey].call(null, req.content.toString())

        /**
         * Return the result to provider.
         */
        channel.sendToQueue(req.properties.replyTo, Buffer.from(JSON.stringify(ret)), {
          correlationId: req.properties.correlationId
        });

        console.log(" [.] Reply: %s ", ret);
      }

      /**
       * Using this code we can be sure that even if you kill a worker using CTRL+C 
       * while it was processing a message, nothing will be lost. Soon after the worker 
       * dies all unacknowledged messages will be redelivered.
       */
      channel.ack(req)
    }, {
      noAck: false
    });
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
