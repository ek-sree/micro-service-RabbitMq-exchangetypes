const amqplib = require('amqplib')

const exchangeName = 'direct_logs'

const args = process.argv.slice(2)
const msg = args[1] || "hello world"
const logType = args[0]

const sendMsg = async()=>{
    const connection = await amqplib.connect('amqp://localhost:5672')
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct',{durable: false});
    channel.publish(exchangeName, logType , Buffer.from(msg));
    console.log("Sent:",msg);
    setTimeout(()=>{
        connection.close();
        process.exit(0);
    },500)
}

sendMsg()