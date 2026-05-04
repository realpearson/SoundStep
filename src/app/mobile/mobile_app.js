//####################################-STATE & GLOBALS-####################################//
let currentSession = createSession();
let currentSimPreset;
let recordingOn = false;

//Make this to state machine later
const APPLICATION_STATES = {
    AWAKE: "awake",
    SETUP: "setup",
    LOOP: "loop",
    PAUSE: "pause",
    EXIT: "exit",
    ERROR: "error"
}

let applicationState = APPLICATION_STATES.AWAKE;


//####################################-DOM ELEMENTS-####################################//

//Sensors
const permissionsButton = document.getElementById("permissionsButton");
const accXElt = document.getElementById("accelX");
const accYElt = document.getElementById("accelY");
const accZElt = document.getElementById("accelZ");

const rotXElt = document.getElementById("rotX");
const rotYElt = document.getElementById("rotY");
const rotZElt = document.getElementById("rotZ");

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

const saveBttn = document.getElementById("saveBttn");
const recordBttn = document.getElementById("recordBttn");

recordBttn.onclick = () => {
  recordingOn = !recordingOn;
  recordBttn.style.backgroundColor = recordingOn ? "#F082AC" : "#EA4C89";
    if(recordingOn) currentSimPreset.onActivate();
    else currentSimPreset.onDeactivate();
};

saveBttn.onclick = () => {
  exportData(currentSession.sessionData)
};


//####################################-PROGRAM FLOW-####################################//

//Starts Program
awakeFunc();


//Define State Functions
function awakeFunc(){
    if (typeof DeviceMotionEvent === "undefined" || typeof DeviceMotionEvent.requestPermission !== "function"){
        //alert("not iOS");
        permissionsButton.hidden = true;
    
        applicationState = APPLICATION_STATES.SETUP;
        setupFunc();
    
    } else {
        //alert("iOS");
        //https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        permissionsButton.onGranted = () => {
            applicationState = APPLICATION_STATES.SETUP;
            setupFunc();
        };
        permissionsButton.addEventListener("pointerup", requestSensorPermission, {once: true});
        permissionsButton.addEventListener("pointreup", ()=> permissionsButton.hidden = true, {once:true});
    }
}

function setupFunc(){
    deviceSensorHandler = createDeviceSensorHandler();
    mainFunc();
    alert("setup");
}

function mainFunc(){

    if(applicationState.EXIT) {
        exitFunc();
        return;
    }

    if(applicationState.PAUSE) {
        window.requestAnimationFrame(mainFunc);
        return;
    };
    
    if(currentSession) currentSession.recordData();
    
    accXElt.textContent = formatDecimal(deviceSensorHandler.accelerationX, 2, "X:");
    accYElt.textContent = formatDecimal(deviceSensorHandler.accelerationY, 2, "Y:");
    accZElt.textContent = formatDecimal(deviceSensorHandler.accelerationZ, 2, "Z:");
    rotXElt.textContent = formatDecimal(deviceSensorHandler.rotationX, 2, "X:");
    rotYElt.textContent = formatDecimal(deviceSensorHandler.rotationY, 2, "Y:");
    rotZElt.textContent = formatDecimal(deviceSensorHandler.rotationZ, 2, "Z:");

    window.requestAnimationFrame(mainFunc);
}


function exitFunc(){

}

function errorFunc(){}



//####################################-HELPER FUNCS-####################################//

function formatDecimal(num, digits, prefix){
  const formatNum = Math.floor(num * Math.pow(10, digits))/ Math.pow(10, digits);
  if(Math.sign(num) < 0) return (prefix || '') + formatNum.toString();
  return ((prefix || '') + ' ' + formatNum.toString());
}

/*
function setup(){
    createCanvas(window.innerWidth, window.innerHeight, appCanvas);
}

const debugElt = document.getElementById("debugP");
let ready = false;

function draw() {
    debugElt.textContent = permissionState;

    if(!ready && permissionState === "Not Needed" || permissionState === "Granted"){
        deviceSensorHandler = createDeviceSensorHandler();
        resizeCanvas(window.innerWidth, window.innerHeight);
        initializeRunRecorder();
        ready = true;
    }
    if(!ready) return;

    //Make all this pg or something...
    background(29);
    //image(logo, -65, 0);
    //recordData();
    if(currentSession) currentSession.recordData();

    noFill();
    stroke(29)
    strokeWeight(40);
    rect(0, 0, width, logo.height);

    stroke(10, 20, 50)
    strokeWeight(10);
    rect(0, 0, width, height);

    stroke(255);
    strokeWeight(2)
    text("dEbOg: " + processorDebug, 10, 380);
    text(deviceSensorHandler.accelerationX, 10, 400);
    text(deviceSensorHandler.accelerationY, 10, 430);
    text(deviceSensorHandler.accelerationZ, 10, 460);

    
    push();
    rotate(-PI);
    translate(50, height/2 - 25);
    fill(255)
    //triangle(0, 0, 50, 25, 0, 50);
    text("This Way Up", 0, 0);
    pop();
    

    stroke(245);
    strokeWeight(4);
    rect(width/4, height/4, width/4, width/4);
    rect(width/4 + width/4, height/4 + width/4-width/5, width/5, width/5);
  
}

*/






