let currentSession = createSession();

let currentSimPreset;

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
  if(ind === -1) return;
  const procArr = MobileAppProcessors[ind].processorArray;
  currentSimPreset?.onDeactivate();
  currentSimPreset = MobileAppProcessors[ind].simulatorSession;
  currentSession = createSession();
  procArr.forEach((proc) => currentSession.connectLowLevelProcessor(proc.processor, proc.processorType, proc.sensorType, proc.dataType));
});


//Recorder
let recordingOn = false;
const saveBttn = document.getElementById("saveBttn");
const recordBttn = document.getElementById("recordBttn");
const title = document.getElementById("Title");
let logo;


function initializeRunRecorder(){
  initializeAppUX();
  logo = loadImage("assets/runningtemp.png");
}

function initializeAppUX(){
  //UI & DOM
  title.style.left = `${windowWidth/2 -120}px`;
  title.style.top = `${50}px`;

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
    if(recordingOn){
      currentSimPreset.onActivate();
    } else {
      currentSimPreset.onDeactivate();
    }
  };

  //iOS Sensor Data Permission Handling
  //recordBttn.addEventListener("mousedown", requestSensorPermission, {once:true});

  sonificationPresets.style.left = `${windowWidth/4}px`;
  sonificationPresets.style.top = `${windowHeight/1.5}px`;
}