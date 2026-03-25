//Handle for releasing screen lock //https://developer.mozilla.org/en-US/docs/Web/API/WakeLockSentinel
let waitLockSentinal = null;

function requestPreventScreenLock(){
  const wakeLock = navigator.wakeLock.request("screen").then((response) => {
    debugResponse(response);
    waitLockSentinal = response;
  }).catch(debugError);
}

let htmlDebug = false;

function debugError(error){
  console.error(error);
  if(!htmlDebug) return;
  const debugDiv = document.getElementById("debug_div");
  const textNode = document.createTextNode(`${error.name}, ${error.message}`);
  debugDiv.appendChild(textNode);
}

function debugResponse(response){
  console.log(response);
  if(!htmlDebug) return;
  const debugDiv = document.getElementById("debug_div");
  const textNode = document.createTextNode(`response: ${response}, type: ${response.type}`);
  debugDiv.appendChild(textNode);
}


//---------------------------------Sensor Events-------------------------------------//
let permissionState = (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") ? "Needed" : "Not Needed";

function requestSensorPermission(){
  if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    alert("requesting")
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        alert("enter"); 
        if (response == "granted") {
          alert("resp" + response);
          permissionState = "Granted";
        } else permissionState = "Failed";
      }).catch(alert);
  } //else-> DeviceMotionEvent is not defined
  alert(permissionState);
}

function requestSensorPermissionnnn(){
  if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          permissionState = "Granted";
        } else permissionState = "Failed";
      }).catch(alert);
  } //else-> DeviceMotionEvent is not defined

  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          permissionState = "Granted";
        } else permissionState = "Failed";
      }).catch(alert);
  } //else-> DeviceMotionEvent is not defined

  if(permissionState === "Granted") deviceSensorHandler = createDeviceSensorHandler();
  else alert(permissionState);
}

function createDeviceSensorHandler(){

  if(permissionState === "Failed" || permissionState === "Needed") return null;

  //Device Motion Buffers
  let accelerationX = 0;
  let accelerationY = 0;
  let accelerationZ = 0;

  let moveEventInterval = -1;

  let rotationRateX = 0;
  let rotationRateY = 0;
  let rotationRateZ = 0;

  //Device Orientation Buffers
  //Should we offset these like in p5 to make them all -180-180?
  let rotationX = 0;
  let rotationY = 0;
  let rotationZ = 0;

  window.addEventListener("devicemotion", (event)=> {
    accelerationX = event.acceleration.x || 0;
    accelerationY = event.acceleration.y || 0;
    accelerationZ = event.acceleration.z || 0;
    moveEventInterval = event.interval;
    rotationRateX = event.rotationRate.alpha || 0;
    rotationRateY = event.rotationRate.gamma || 0;
    rotationRateZ = event.rotationRate.beta || 0;
  });
  
  /*
  window.addEventListener("deviceorientation", (event)=> {
    rotationX = event.alpha; // 0 (inclusive) to 360 (exclusive)
    rotationY = event.gamma; //-90 (inclusive) to 90 (exclusive). Left to right motion of the device.
    rotationZ = event.beta; // -180 (inclusive) to 180 (exclusive). Front to back motion of the device.
  });
  */

  return {
    //Device Motion
    get accelerationX(){return accelerationX},
    get accelerationY(){return accelerationY},
    get accelerationZ(){return accelerationZ},
    get rotationRateX(){return rotationRateX},
    get rotationRateY(){return rotationRateY},
    get rotationRateZ(){return rotationRateZ},
    get moveEventInterval(){return moveEventInterval},
    //Device Orientation
    get rotationX(){return rotationX},
    get rotationY(){return rotationY},
    get rotationZ(){return rotationZ},
  }
}

const deviceSensorHandler = createDeviceSensorHandler();
//---------------------------------Import Export Data-------------------------------------//

//Export run data from mobile application
function exportData(data){
  let a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type:'text/plain'}));
  a.download = "runData" + ".json";
  a.click();
  URL.revokeObjectURL(a);
  //console.log(a.parentNode)
  //document.removeChild(a);
}

//Upload local RUN data from COMPUTER FINDER
function uploadData(onUploaded) {
  const fileList = this.files; /* now you can work with the file list */
  const file = fileList[0]
  //console.log(file)
  //console.log(file.type)

  const reader = new FileReader();

  reader.onload = function(e) {
    if(file.type === 'application/json'){
      //console.log(e.target.result)
      fetch(e.target.result)
        .then((response) => response.json())
        .then((json) => {
          //onUploaded(json);
          //simulator = createSimulator(json);
          onImportData(json)
      });
    }
  }

  reader.readAsDataURL(file);
}

//This is still very ugly...
//Called by fetch in datahandler.js
function onImportData(data){
  currentData = data;
  simulator = createSimulator(data);
  //simulator.setDataPos(450);
}

//Upload local RUN data FROM PROJECT FOLDER to sandbox mode
async function fetchLocalData(event){
  if(event.target.value){
    const requestURL = event.target.value;
    const request = new Request(requestURL);
    const response = await fetch(request);
    const data = await response.json();
    currentData = data;
    simulator = createSimulator(data);
    //Dont hard code this...
    //simulator.loadPreset(asphaltWithAmbienceSession);
    //simulator.setDataPos(500);
  }
}