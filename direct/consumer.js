 const amqplib = require('amqplib');

 const args = process.argv.slice(2)
 
 if(args.length == 0){
     console.log("Usage: recieve_logs_direct [info] [warning] [error]");
     process.exit(1)
    }
    
const exchangeName = "direct_logs";

const recieveMsg = async()=>{
    const connection = await amqplib.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName,'direct',{durable:false})
    const q = await channel.assertQueue('', {exclusive:true})
    console.log(`waiting for message in queue: ${q.queue}`);
    args.forEach(severity=>{
        channel.bindQueue(q.queue, exchangeName, severity);
    })
    channel.consume(q.queue, msg=>{
        if(msg.content)console.log(`The routekey is ${msg.fields.routingKey},and message is : ${msg.content.toString()}`);
    },{noAck:true})
}

recieveMsg();