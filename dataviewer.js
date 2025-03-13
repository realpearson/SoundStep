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

const resetButton = document.getElementById("Reset");
resetButton.onclick = () => {
  if(!simulator) return;
  simulator.reset();
}

//This is still very ugly...
//Called by fetch in datahandler.js
function onImportData(data){
  currentData = data;
  simulator = createSimulator(data);
  //simulator.setDataPos(450);
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

    //Dont hard code this...
    simulator.loadPreset(musicBSimulatorPreset);
    simulator.setDataPos(500);
  }
}
dataSelect.addEventListener("change", fetchLocalData);

function updateSimulator(){
  if(!simulator) return;
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
    let x = i;
    if(buffer.length >= width) x -= (buffer.length-width);
    point(x, -buffer[i].value * scalar + yPos);
    //vertex(i, -buffer[i].value * scalar + yPos);

    if(buffer[i].isPeak) circle(x, -buffer[i].value * scalar + yPos, 5);
    if(buffer[i].isZeroCrossing) {
      fill(240, 0, 0);
      circle(x, -buffer[i].value * scalar + yPos, 5);
      noFill();
    }
  }
  endShape();
}


function createSimulator(data){
  //Loaded in via preset
  let processors;
  let render;
  let preset;

  //Internal Logic
  let active = false;
  let inc = 0;
  let timeOffsetAccumulator = 0;
  let dataFrameLen = calcDataFR();
  const discrepencyThreshold = 2;

  function calcDataFR(){
    let totMillis = 0;
    for(let i = 1; i < data.session.length; i++){
      totMillis += data.session[i].timestamp-data.session[i-1].timestamp;
    }    
    return (totMillis / data.session.length-1);
  }


  function increment(debug){
    if(!active) return;
    if(inc >= data.session.length-1) return;

    //Accumulate difference between target frame length and actual
    timeOffsetAccumulator += deltaTime-dataFrameLen;

    if(timeOffsetAccumulator > discrepencyThreshold * dataFrameLen){
      //Insert extra frame to compensate
      step(debug);
      step(debug);
      timeOffsetAccumulator -= discrepencyThreshold * dataFrameLen;
    } else if(timeOffsetAccumulator < -discrepencyThreshold * dataFrameLen){
      //Skip frame to compensate
      timeOffsetAccumulator += discrepencyThreshold * dataFrameLen;
    } else {
      step(debug);
    }
    
    if(debug) console.log("------------------");
  }

  function step(debug){
    processors.forEach((p) => {
      p.processor.analyzeRealtime(data.session[inc][p.sensorType][p.axis], debug);
    });

    inc++;
  }


  function reset(){
    //Reset Simulator
    timeOffsetAccumulator = 0;
    inc = 0;
    //Reset Processors
    processors.forEach((p) => p.processor.resetProcessor());
  }
  
  return {
    get increment(){return increment},
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
    }},
    get reset(){return reset}
  }
}