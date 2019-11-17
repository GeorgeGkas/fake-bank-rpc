# Fake Bank APP

A (dead) simple RPC based banking application.

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
$ docker run -d --hostname my-rabbit --name fake-bank rabbitmq:3
```
