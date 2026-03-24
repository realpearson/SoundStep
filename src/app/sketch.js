const appDiv = document.getElementById("AppView");
const appCanvas = document.getElementById("appCnv");
const desktopDiv = document.getElementById("DesktopView");
const desktopCanvas = document.getElementById("desktopCnv");

//https://getcssscan.com/css-buttons-examples
//https://www.fasttalklabs.com/physiology/how-to-analyze-running-form/

let AppMode = "none";


const appModeSelectElt = document.getElementById("selectAppMode");

function AppModeSelectListener(event){

  AppMode = event.target.value;

  if(AppMode === "Mobile"){
    appDiv.hidden = false;
    if(deviceSensorHandler === null) requestSensorPermission();
    createCanvas(window.innerWidth, window.innerHeight, appCanvas);
    initializeRunRecorder();
    
  }
  
  if(AppMode === "Sandbox"){
    desktopDiv.hidden = false;
    createCanvas(900, 900, desktopCanvas);
  }

  appModeSelectElt.hidden = true;
}

appModeSelectElt.addEventListener("change", AppModeSelectListener);

function draw() {

  if(AppMode === "none") return;
  
  if(AppMode === "Mobile"){
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
    
    /*
    push();
    rotate(-PI);
    translate(50, height/2 - 25);
    fill(255)
    //triangle(0, 0, 50, 25, 0, 50);
    text("This Way Up", 0, 0);
    pop();
    */
    

    stroke(245);
    strokeWeight(4);
    rect(width/4, height/4, width/4, width/4);
    rect(width/4 + width/4, height/4 + width/4-width/5, width/5, width/5);
  }
  
  if(AppMode === "Sandbox"){
    background(220);
    updateSimulator();
  }
}








