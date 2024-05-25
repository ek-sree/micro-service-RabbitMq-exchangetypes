const amqplib = require('amqplib')

const queueName = 'hello'

const recieveMsg = async () =>{
  try {
    let connection = await amqplib.connect('amqp://localhost:5672');
    let channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: true })
    channel.prefetch(1)
    console.log(`waiting for the messages in queue : ${queueName}`);
    channel.consume(queueName, msg =>{
        const sec =  msg.content.toString().split('.')
        console.log("[x] Recieved :", msg.content.toString());
        setTimeout(()=>{
            console.log("Done resizing image");
            channel.ack(msg);
        }, sec * 1000)
    },{noAck: false})
  } catch (error) {
    console.log(error);
  }
}

recieveMsg()