const amqplib = require('amqplib')

const exchangeName = "logs"
const msg = process.argv.slice(2).join(' ') || "hello world"

const sendMsg = async()=>{
    try {
        const connection = await amqplib.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', {durable:false});
    channel.publish(exchangeName,'', Buffer.from(msg));
    console.log("sent :", msg);
    setTimeout(()=>{
        connection.close();
        process.exit(0)
    },500)
    } catch (error) {
        console.log(error);
    }
}

sendMsg()