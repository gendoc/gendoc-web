const amqp = require('amqplib');
require('dotenv').config({path:'./.env'});
const RABBITMQ_USER=process.env.RABBITMQ_USER
const RABBITMQ_PASSWORD=process.env.RABBITMQ_PASSWORD
const RABBITMQ_HOSTNAME=process.env.RABBITMQ_HOSTNAME
const RABBITMQ_VIRTUAL_HOST=process.env.RABBITMQ_VIRTUAL_HOST

let rabbitMQChannel
const exchangeName = 'amq.direct';
const exchangeType = 'direct';



async function connect() {
    try {
        const connection =
            await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOSTNAME}:5672/${RABBITMQ_VIRTUAL_HOST}`);
        rabbitMQChannel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error(error);
    }
}

async function send(queue, message, routingKey) {
    try {
        if (rabbitMQChannel==null){return}
        rabbitMQChannel.assertExchange(exchangeName, exchangeType, { durable: true });
        rabbitMQChannel.publish(exchangeName, routingKey, Buffer.from(message));
        console.log(`Sent message: ${message}`);
    } catch (error) {
        console.error(error);
    }
}

async function receive(queue, callback) {
    try {

        rabbitMQChannel.assertQueue(queue);
        rabbitMQChannel.consume(queue, (message) => {
            console.log(`Received message: ${message.content.toString()}`);
            callback(JSON.parse(message.content))
            rabbitMQChannel.ack(message)
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {connect,rabbitMQChannel,send,receive
}