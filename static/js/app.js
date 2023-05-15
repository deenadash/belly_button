belly = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let dataBase = {};

d3.json(belly).then(function(data) {
  dataBase = data;
  init(data);
  //Enable the dropdown seletion after storing the data from url and initializing the web page
  document.getElementById("selDataset").removeAttribute("disabled")
});


function init(data){
  dropDown(data.names);
  sample_array = dataBase.samples.filter(item => item.id === "940");
  metaData = dataBase.metadata.filter(item => item.id === 940);
  // init bar plot
  barPlot(sample_array,true);
  // init bubble plot
  bubblePlot(sample_array,true);
  // init HTML panel
  panelDemo(metaData);
  // build gauge chart
  buildGauge(sample_array.wfreq);
};


function optionChanged(value){
  console.log(value);
  sample_array = dataBase.samples.filter(item => item.id === value);
  metaData = dataBase.metadata.filter(item => item.id === parseInt(value));
  barPlot(sample_array,false);
  bubblePlot(sample_array,false);
  panelDemo(metaData);
};


function dropDown(names_id){
  //array to store html to add to the select list
  var html = [];
  //loop through the array
  for (var i = 0; i < names_id.length; i++) {
  //add the option elements to the html array
    html.push("<option>" + names_id[i] + "</option>");
  }
  document.getElementById("selDataset").innerHTML = html.join("");
};

function panelDemo(metaData){
  //array to store html to add to the select list
  var html = [];
  //loop through the array
  for (var key in metaData[0]) {
  //add the option elements to the html array
    var value = metaData[0][key];
    html.push('<h6>'+ (`${key.toUpperCase()} : ${value}`) +'</h6>');
  }
  document.getElementById("sample-metadata").innerHTML = html.join("");
};


function barPlot(inputArray, isInit){
  // Slice the first 10 objects for plotting
  let otu_idsTen = inputArray[0].otu_ids.slice(0,10);
  let sample_valuesTen = inputArray[0].sample_values.slice(0,10);
  let otu_labelsTen = inputArray[0].otu_labels.slice(0,10);
  
  let data = [{
    x: sample_valuesTen.reverse(),
    y: otu_idsTen.reverse().map(item => ` OTU ${item}`),
    type: "bar",
    orientation:"h",
    text:otu_labelsTen
  }];

  let layout = {
    title: "Top 10 Bacterial Cultures Found",
    margin: {t: 30, l: 150}
  };

  if (isInit){
    Plotly.newPlot("bar", data, layout);
  }
  else{
    console.log(data);
    Plotly.restyle("bar", 'y',  [otu_idsTen.map(item => ` OTU ${item}`)]);
    Plotly.restyle("bar", 'x',  [sample_valuesTen]);
  }
};


function bubblePlot(inputArray, isInit){

  var trace1 = {
    x: inputArray[0].otu_ids,
    y: inputArray[0].sample_values,
    text: inputArray[0].otu_labels,
    mode: 'markers',
    marker: {
      size: inputArray[0].sample_values,
      color: inputArray[0].otu_ids,
      colorscale: 'Portland',
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: "Bacterial cultures per Sample",
    margin: { t : 0},
    hovermode: "closest",
    xaxis: { title: "OTU ID"},
    margin: {t: 30}
  };

  if (isInit){
    Plotly.newPlot("bubble", data, layout);
  }
  else{
    Plotly.restyle("bubble", 'y',  [inputArray[0].sample_values]);
    Plotly.restyle("bubble", 'x',  [inputArray[0].otu_ids]);
    Plotly.restyle("bubble", 'text',  [inputArray[0].otu_labels]);
    Plotly.restyle("bubble", 'marker.size',  [inputArray[0].sample_values]);
    Plotly.restyle("bubble", 'marker.color',  [inputArray[0].otu_ids]);
  }
};

function buildGauge(wfreq){
  var gaugeData = [
    {
        type: "indicator", 
        mode: "gauge+number",
        title: {text: "scrubs per week"},
        gauge:{
            axis: {range: [0, 9]},
            bar: {color: "rgb(46, 74, 90)"}, // change bar colour
            // seperate 0 to 9 into 9 sections
            steps: [
                {range: [0, 1], color: "rgb(203, 236, 235)"},
                {range: [1, 2], color: "rgb(180, 219, 220)"},
                {range: [2, 3], color: "rgb(158, 201, 207)"},
                {range: [3, 4], color: "rgb(136, 184, 194)"},
                {range: [4, 5], color: "rgb(114, 167, 181)"},                    
                {range: [5, 6], color: "rgb(94, 149, 169)",},
                {range: [6, 7], color: "rgb(74, 132, 157)"},
                {range: [7, 8], color: "rgb(55, 116, 145)"},
                {range: [8, 9], color: "rgb(35, 99, 133)"}             
            ],

        },
        value: metaData.wfreq // display the value
    }
];

// arrow angle calculation 
var value = metaData.wfreq / 9 * 180;
var r = 0.4;
var degree = 180 - value;
var x_head = r * Math.cos(Math.PI/180*degree);
var y_head = r * Math.sin(Math.PI/180*degree);


let gaugeLayout = {
    title: {
        text: "<b>Belly Button Washing Frequency</b>", // bold title
        font: {size: 18}
    },
    xaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
    yaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
    showlegend: false,
    annotations: [{
        // locating the arrow into right position
        ax: 0.5,
        ay: 0.23,
        axref: 'x',
        ayref: 'y',
        x: 0.5 + x_head,
        y: 0.23 + y_head,
        xref: 'x',
        yref: 'y',
        // arrow colour and size and display arrow
        showarrow: true,
        arrowhead: 9,
        arrowsize: 1.5,
        arrowcolor: "rgb(6, 60, 91)"
    }]
};
// plot the gauge chart
Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}