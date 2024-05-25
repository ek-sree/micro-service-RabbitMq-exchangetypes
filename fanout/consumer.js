const amqplib = require("amqplib");

const exchangeName = "logs";

const recieveMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "fanout", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true }); //leave blank string will automatically generate queue name and exclusive true means once the connection closes then it automatically delete the queue
  console.log(`waiting for the message in queue : ${q.queue}`);
  channel.bindQueue(q.queue, exchangeName,'');
  channel.consume(q.queue, msg=>{
    if(msg.content){
        console.log("the message is :", msg.content.toString());
    }
  },{noAck:true})
};

recieveMsg();
