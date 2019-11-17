# Fake Bank APP

A (dead) simple RPC based banking application.

This app was created for educational purposes to test RPC capabilities in Node and is not suitable for production environments. Many things should be designed differently. For instance, this app was does not scale properly. Each exchange points to a queue that is consumed by only one consumer. For this architecture to be more effective, we should dynamically add more consumers when we find that a particular queue gets very big. This is a basic load balancing solution that could increase tasks resolving time.

## Implementation details

This project was build with [RabbitMQ](https://www.rabbitmq.com/) message broker (through [docker image](https://hub.docker.com/_/rabbitmq/)) using [amqplib](http://www.squaremobius.net/amqp.node/) Node client.

## Installation

*Note: The following commands might require admin privileges to execute.*

Fetch the docker image of RabbitMQ:

```bash
$ docker pull rabbitmq
```

Start the container on localhost:

```bash
$ docker run -d -p 5672:5672 -p 15672:15672 --hostname localhost --name fake-bank rabbitmq:3
```

Install the required project dependencies:

```bash
/path/to/project$ npm i 
```

## Run

Start the server:

```bash
/bin$ ./server.js 
```

Start the client

```bash
/bin$ ./client.js <endpoint> <payload>
```

The requested payload must be a JSON stringified value (eg `"{\"payload\": \"value\"}"`).
