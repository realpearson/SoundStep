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


const loadBttn = document.getElementById("loadBttn");
loadBttn.addEventListener("change", uploadData, false);

const runDataSelect = document.getElementById("SelectRunData");
const presetSelect = document.getElementById("PresetSelectDesktop");

MobileAppProcessors.forEach((preset) => {
  const opt = document.createElement("option");
  opt.value = preset.name;
  opt.innerHTML = preset.name;
  presetSelect.appendChild(opt);
});

presetSelect.addEventListener("change", () => {
  let ind = -1;
  for(let i = 0; i < MobileAppProcessors.length; i++){
    if(MobileAppProcessors[i].name === presetSelect.value) ind = i;
  }
  if(ind === -1) return;
  simulator?.loadPreset(MobileAppProcessors[ind].simulatorSession);
});

runDataSelect.addEventListener("change", fetchLocalData);



function updateSimulator(){
  if(!simulator) return;
  simulator.increment();
  simulator.render();
}



////////////SKETCH

const appDiv = document.getElementById("AppView");
const appCanvas = document.getElementById("appCnv");
const desktopDiv = document.getElementById("DesktopView");
const desktopCanvas = document.getElementById("desktopCnv");




function setup(){
  createCanvas(900, 900, desktopCanvas);
}

function draw() {
  background(220);
  updateSimulator();
}









