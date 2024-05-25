const amqplib = require("amqplib");

const queueName = "hello";
const msg = process.argv.slice(2).join() || "hellooo";

const sendMsg = async () => {
    let connection;
    let channel;
  try {
    connection = await amqplib.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(msg), {persistent:true});
    console.log("sent:", msg);
  } catch (error) {
    console.log(error);
  }finally{
    if(channel)await channel.close()
        if(connection) await connection.close()
  }
};

sendMsg();
