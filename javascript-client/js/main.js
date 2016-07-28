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

    clients[msg.id]=createGraph(canvas);
  }
}

function createGraph(canvas){
  var data={};
  data["labels"]=[];
  data["datasets"]=[];
  var data_array=[];
  for (var i=0; i<20; i++){
    data.labels.push("");
    data_array.push(0);
  }  

  var categories = ['cpu','memory','disk'];
//  var colors = ['#E95420','#77216F','#AEA79F'];
  var colors = ['#f44336','#3f51b5','#4caf50']
  for (var i = 0; i < categories.length; i++) {
    var seriesData = {
            fill: false,
            lineTension: 0.3,
            backgroundColor: colors[i],
            borderColor: colors[i],
            borderCapStyle: 'butt',
            borderJoinStyle: 'miter',
            pointBorderColor: colors[i],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointRadius: 1,
            data: data_array };
    seriesData.label = categories[i]; //set label
    data.datasets.push(JSON.parse(JSON.stringify(seriesData))); //make a copy
  };

  var lineChart = new Chart(canvas, {
    type: 'line',
    data: data,
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    max: 100,
                    min: 0,
                    stepSize: 10
                }
            }]
        }
    }
  });

  return lineChart;
};

function updateGraph(graph, newDataValues){
  for (var i = 0; i < newDataValues.length; i++){
    (graph.data.datasets[i].data).splice(0,1);
    (graph.data.datasets[i].data).push(newDataValues[i]);
  }
  graph.update();
}
