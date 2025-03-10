let currentSession = createSession();

const sonificationPresets = document.getElementById("SonificationPresets");
MobileAppProcessors.forEach((preset) => {
  const opt = document.createElement("option");
  opt.value = preset.name;
  opt.innerHTML = preset.name;
  sonificationPresets.appendChild(opt);
});

sonificationPresets.addEventListener("change", () => {
  let ind = -1;
  for(let i = 0; i < MobileAppProcessors.length; i++){
    if(MobileAppProcessors[i].name === sonificationPresets.value) ind = i;
  }
  const procArr = MobileAppProcessors[ind].processorArray;

  procArr.forEach((proc) => currentSession.connectRealtimeProcessor(proc.processor, proc.sensorType, proc.axis));
});


//Recorder
let recordingOn = false;
const saveBttn = document.getElementById("saveBttn");
const recordBttn = document.getElementById("recordBttn");
let logo;


function initializeRunRecorder(){
  initializeAppUX();
  logo = loadImage("assets/runningtemp.png");
}

function initializeAppUX(){
  //UI & DOM
  saveBttn.style.left = `${windowWidth/2 -26}px`;
  saveBttn.style.top = `${windowHeight-50}px`;
  //saveBttn.hidden = false;
  saveBttn.onclick = () => {
    exportData(currentSession.sessionData)
  };
  
  recordBttn.style.left = `${windowWidth/2 -30}px`;
  recordBttn.style.top = `${windowHeight-110}px`;
  //recordBttn.hidden = false;
  recordBttn.onclick = () => {
    recordingOn = !recordingOn;
    recordBttn.style.backgroundColor = recordingOn ? "#F082AC" : "#EA4C89";
  };

  sonificationPresets.style.left = `${windowWidth/2 -26}px`;
  sonificationPresets.style.top = `${windowHeight/2 -26}px`;
}


function recordData(){
  if(!recordingOn) return;
  currentSession.recordData({
    acceleration: {x:accelerationX, y:accelerationY, z:accelerationZ},
    rotation: {x:rotationX, y:rotationY, z:rotationZ}
  });
}




/*
const listeners = {
  onHiPeakEvents: [() => testSound1.play()],
  onLoPeakEvents: [() => testSound2.play()]
}

//Maps to Y in belt
const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, listeners);
currentSession.connectRealtimeProcessor(peakXProcessor, "acc", "x");
buffers.push(peakXProcessor);

//Maps to X in belt
const peakYProcessor = createPeakAnalyzer(defaultPeakSettings, listeners);
currentSession.connectRealtimeProcessor(peakYProcessor, "acc", "y");
buffers.push(peakYProcessor);

//Still Z
const peakZProcessor = createPeakAnalyzer(defaultPeakSettings, listeners);
currentSession.connectRealtimeProcessor(peakZProcessor, "acc", "z");
buffers.push(peakZProcessor)
*/