const amqplib = require('amqplib');

const args = process.argv.slice(2);

if(args.length == 0){
    console.log("Usage: ");
    process.exit(1)
}

const exchangeName = "topic_exchange";

const recieveMsg = async()=>{
    const connection = await amqplib.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName,'topic', {durable:false});
    const q = await channel.assertQueue('', {exclusive: true});
    console.log(`Waiting for the message in queue : ${q.queue}`);
    args.forEach(key=>{
        channel.bindQueue(q.queue, exchangeName, key);
    });
    channel.consume(q.queue, msg=>{
        if(msg.content)console.log(`Routing key: ${msg.fields.routingKey}, Message is : ${msg.content.toString()}`);
    },{noAck:true})
}

recieveMsg();