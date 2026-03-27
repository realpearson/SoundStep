//Make this to state machine later
const APPLICATION_STATES = {
    AWAKE: "awake",
    SETUP: "setup",
    LOOP: "loop",
    PAUSE: "pause",
    EXIT: "exit"
}

let applicationState = APPLICATION_STATES.AWAKE;

//DOM Element References
const permissionsButton = document.getElementById("permissionsButton");
const accXElt = document.getElementById("accelX");
const accYElt = document.getElementById("accelY");
const accZElt = document.getElementById("accelZ");

const rotXElt = document.getElementById("accelX");
const rotYElt = document.getElementById("accelX");
const rotZElt = document.getElementById("accelX");

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
    
        permissionsButton.addEventListener("click", ()=> {
            permissionsButton.hidden = true;
        });
    }
}



function setupFunc(){
    //deviceSensorHandler = createDeviceSensorHandler();
    mainFunc();
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

    accXElt.textContent = deviceSensorHandler.accelerationX;
    accYElt.textContent = deviceSensorHandler.accelerationY;
    accZElt.textContent = deviceSensorHandler.accelerationZ;
    //rotXElt.textContent = deviceSensorHandler.rotationX;
    //rotYlt.textContent = deviceSensorHandler.rotationY;
    //rotZElt.textContent = deviceSensorHandler.rotationZ;

    window.requestAnimationFrame(mainFunc);
}


function exitFunc(){

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






