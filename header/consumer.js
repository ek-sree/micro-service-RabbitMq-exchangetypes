const amqplib = require('amqplib')

const exchangeName = "header_logs";


const recieveMsg = async()=>{
    const connection = await amqplib.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'headers', {durable:false});
    const q = await channel.assertQueue('', {exclusive:true});
    console.log(`Waiting for message in queue :${q.queue}`);
    channel.bindQueue(q.queue, exchangeName, '', {'account':'new', "method":"facebook","x-match":"any"});
    channel.consume(q.queue, msg=>{
        if(msg.content)console.log(`Routing key: ${JSON.stringify(msg.properties.headers)}, message: ${msg.content.toString()}`);
    },{noAck:true})
}

recieveMsg()