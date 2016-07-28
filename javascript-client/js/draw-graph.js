//This file contains logic for drawing graph
//To keep things simple, series ['cpu','memory','disk'] have been assumed

//Create graph using Chart.JS. Inserts html needed into page, creates JSON object and initializes graph
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
  var colors = ['#f44336','#3f51b5','#4caf50']
  for (var i = 0; i < categories.length; i++) { //repeat for each series
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
                ticks: { //set scale 0-100 as showing percentage
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

//Update graph. Deletes first data point of each dataset, and
//appends new updated datapoint on end using newDataValues (array)
function updateGraph(graph, newDataValues){
  for (var i = 0; i < newDataValues.length; i++){
    (graph.data.datasets[i].data).splice(0,1); 
    (graph.data.datasets[i].data).push(newDataValues[i]);
  }
  graph.update(); //Chart.js redraw graph
}
