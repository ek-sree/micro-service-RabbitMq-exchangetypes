const amqplib = require('amqplib')

const exchangeName = "header_logs";
const args = process.argv.slice(2);
const msg =  args[0] || "Hello world";

const sendMsg = async()=>{
    const connection = await amqplib.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'headers', {durable:false});
    channel.publish(exchangeName, '', Buffer.from(msg), {headers:{account:"new", method:"google"}});
    console.log("sent :", msg);
    setTimeout(()=>{
        connection.close()
        process.exit(0)
    },500)
}

sendMsg()