client = new Paho.MQTT.Client("localhost",8081, "clientId");

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({onSuccess:onConnect});

var clients = [];

// called when the client connects
function onConnect() {
  console.log("onConnect");
  client.subscribe("mqttdemo/status");
  message = new Paho.MQTT.Message("Hello");
  message.destinationName = "/World";
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  msg = JSON.parse(message.payloadString)
  console.log(msg);

  if (typeof clients[msg.id] != "undefined"){ 
    //function in draw-graph.js
    updateGraph(clients[msg.id],[msg.cpu,msg.memory,msg.disk]); 
  } else {
    //insert new html and chart for client
    var div = document.createElement("div");
    div.setAttribute('class', 'col-md-6');
    div.innerHTML = "hostname: "+msg.hostname
    document.getElementById('main').appendChild(div);
    var canvas = document.createElement("canvas");
    canvas.setAttribute('id',msg.id);
    canvas.setAttribute('height',200);
    canvas.setAttribute('width',400);
    div.appendChild(canvas);

    //function in draw-graph.js
    clients[msg.id]=createGraph(canvas); 
  }
}
