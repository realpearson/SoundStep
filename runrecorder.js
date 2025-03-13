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
  procArr.forEach((proc) => currentSession.connectRealtimeProcessor(proc.processor, proc.sensorType, proc.axis));
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
  recordBttn.addEventListener("mousedown", requestSensorPermission, {once:true});

  sonificationPresets.style.left = `${windowWidth/4}px`;
  sonificationPresets.style.top = `${windowHeight/1.5}px`;
}


function recordData(){
  if(!recordingOn) return;
  currentSession.recordData({
    acceleration: {x:accelerationX, y:accelerationY, z:accelerationZ},
    rotation: {x:rotationX, y:rotationY, z:rotationZ}
  });
}


function requestSensorPermission() {
  if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    alert("enter"); //Do we need this?
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        alert("resp" + response);
        if (response == "granted") {
          //do we need to do anything here or is this enough
          //for p5 to take over and start working?
        }
      }).catch(console.error);
  } //else-> DeviceMotionEvent is not defined
}

/*         
 window.addEventListener("devicemotion", (e) => {
            // do something with e
            console.log(e);
          });
 */


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