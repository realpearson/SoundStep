let simulator;
let currentData = null;

let laneSpacing = 120;
const maxDataLanes = 4; //We can instantiate these if we don't hard code them in HTML
const dataLanes = getDataLanes();

function getDataLanes(){
  const laneElements = [];
  for(let i = 0; i < maxDataLanes; i++) {
    laneElements.push(document.getElementById(`Lane${i+1}`));
    laneElements[i].style.top = `${i * laneSpacing}px`;
  }
  return laneElements;
}


const playButton = document.getElementById("Play");
playButton.onclick = () => {
  if(!simulator) return;
  simulator.play();
}
  

const stopButton = document.getElementById("Stop");
stopButton.onclick = () => {
  if(!simulator) return;
  simulator.stop();
}


function onImportData(data){
  currentData = data;
  simulator = createSimulator(data, testProcessorArr);
  simulator.setDataPos(450);
}

const loadBttn = document.getElementById("loadBttn");
loadBttn.addEventListener("change", uploadData, false);

const dataSelect = document.getElementById("SelectRunData");

async function fetchLocalData(event){
  if(event.target.value){
    const requestURL = event.target.value;
    const request = new Request(requestURL);
    const response = await fetch(request);
    const data = await response.json();
    currentData = data;
    simulator = createSimulator(data);

    simulator.loadPreset(gravelSimulatorPreset);
    simulator.setDataPos(450);
  }
}
dataSelect.addEventListener("change", fetchLocalData);

function updateSimulator(){
  if(!simulator) return;

  //Add frame rate target algorithm
  simulator.increment();
  simulator.increment();
  simulator.render();
}

function alignmentChecker(){
  line(mouseX, 0, mouseX, height);
}


function renderDataCurve(buffer, scalar, yPos, name){
  strokeWeight(1);
  stroke(0)
  text(name, 80, yPos-45);
  noFill();
  line(0, yPos, width, yPos); //null axis
    
  beginShape();
  if(buffer.length < 1) return;
  for(let i = 0; i < buffer.length; i++){
    point(i, -buffer[i].value * scalar + yPos);
    //vertex(i, -buffer[i].value * scalar + yPos);

    if(buffer[i].isPeak) circle(i, -buffer[i].value * scalar + yPos, 5);
    if(buffer[i].isZeroCrossing) {
      fill(240, 0, 0);
      circle(i, -buffer[i].value * scalar + yPos, 5);
      noFill();
    }
  }
  endShape();
}


function createSimulator(data){
  let processors;
  let render;
  let preset;

  let active = false;
  
  let inc = 0;
  
  function increment(debug){
    if(!active) return;
    if(inc >= data.session.length-1) return;

    processors.forEach((p) => {
      p.processor.analyzeRealtime(data.session[inc][p.sensorType][p.axis], debug);
    });

    inc++;
    
    if(debug) console.log("------------------");
  }

  function getCurrentData(sensorType, axis){
    return data.session[inc][sensorType][axis];
  }

  function getRawData(sensorType, axis){
    const bucket = [];
    data.session.forEach((d) => {
      bucket.push({value: d[sensorType][axis]});
    });
    return bucket;
  }
  
  return {
    get increment(){return increment},
    get getCurrentData(){return getCurrentData},
    get getRawData(){return getRawData},
    get setDataPos(){return (pos) => {inc = pos < data.session.length ? pos : inc}},
    get dataPos(){return inc},
    get loadPreset(){return function(simPreset){
      processors = simPreset.processors;
      render = simPreset.render;
      preset = simPreset;
    }},
    get play(){return () => {
      active = true;
      preset.onActivate();
    }},
    get stop(){return () => {
      active = false;
      preset.onDeactivate();
    }},
    get render(){return function(){
      if(render) render();
    }}
  }
}


/*function createSimulator(data, processors){
  
  let inc = 0;
  
  function increment(debug){
    if(inc >= data.session.length-1) return;
    //tempBuffer.analyzeRealtime(dataBuffer.data[inc], debug)
    processors.forEach((p) => {
      p.processor.analyzeRealtime(data.session[inc][p.sensorType][p.axis], debug);
    });
    inc++;
    if(debug) console.log("------------------");
  }

  function getCurrentData(sensorType, axis){
    return data.session[inc][sensorType][axis];
  }

  function getRawData(sensorType, axis){
    const bucket = [];
    data.session.forEach((d) => {
      bucket.push({value: d[sensorType][axis]});
    });
    return bucket;
  }
  
  return {
    get increment(){return increment},
    get getCurrentData(){return getCurrentData},
    get getRawData(){return getRawData},
    get setDataPos(){return (pos) => {inc = pos < data.session.length ? pos : inc}},
    get dataPos(){return inc}
  }
} */



//EVENTS
//-Hi/lo peaks
//-zero crossing
//-Basic thresholds 

//Modulations
//-raw


//Data viewer
//Simulator playback (match fps of user, use audio scheduling?)
//Simulator Debug stepper (debug processing algos)
//Simulator start, stop, reset

//Data lanes
//Global data
//Data increment pos (array)
//points/ vertex
//Zoom vertical/ horizontal
//Scroll
//What data to assign to lanes (to see)

//Add custom sounds/ events
//Synth patches, audio manipulation
