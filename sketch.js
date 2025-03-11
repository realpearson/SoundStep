const appDiv = document.getElementById("AppView");
const appCanvas = document.getElementById("appCnv");
const desktopDiv = document.getElementById("DesktopView");
const desktopCanvas = document.getElementById("desktopCnv");
const appState = createAppState();

const testSound1 = new soundContainer("assets/audio_files/notes-1.wav", audioCtx);
const testSound2 = new soundContainer("assets/audio_files/notes-2.wav", audioCtx);

//https://getcssscan.com/css-buttons-examples
//https://www.fasttalklabs.com/physiology/how-to-analyze-running-form/

//Scripts/ folders
//data_processing
//sound_engine
//desktop_sandbox
//mobile_app
//>UX
//>Recorder


//desktop_sandbox, user_app
function createAppState(){
  let mode = window.innerWidth <= 600 ? "mobile" : "desktop";
  
  return {
    get modes(){return {mobile: "mobile", desktop: "desktop"}},
    get mode(){return mode},
  }
}


function setup() {  
  if(appState.mode === appState.modes.mobile){
    appDiv.hidden = false;
    createCanvas(window.innerWidth, window.innerHeight, appCanvas);
    initializeRunRecorder();
    
  }
  
  if(appState.mode === appState.modes.desktop){
    desktopDiv.hidden = false;
    createCanvas(900, 500, desktopCanvas);
  }

}

function draw() {
  
  if(appState.mode === appState.modes.mobile){
    //Make all this pg or something...
    background(29);
    //image(logo, -65, 0);
    recordData();
    
    noFill();
    stroke(29)
    strokeWeight(40);
    rect(0, 0, width, logo.height);
    
    stroke(10, 20, 50)
    strokeWeight(10);
    rect(0, 0, width, height);
    
    stroke(255);
    strokeWeight(2)
    text(rotationX, 10, 400);
    text(rotationY, 10, 430);
    text(rotationZ, 10, 460);
    
    push();
    translate(width-75, height/2 - 25);
    fill(255)
    triangle(0, 0, 50, 25, 0, 50);
    pop();
  }
  
  if(appState.mode === appState.modes.desktop){
    background(220);
    updateSimulator();
  }

  
  /*
  //Render Buffers
  let yPos = 50//400;
  buffers.forEach((buffer) => {
    renderDataCurve(buffer, 1, yPos);
    yPos+=50;
  });
  */
}



function mousePressed(){
  //console.log(frameRate());
  //if(simulator) simulator.increment(true);
  
  if(appState.mode === appState.modes.mobile){
    //fullscreen(true);
    //resizeCanvas(windowWidth, windowHeight);
    //initializeAppUX();
  }
  
}

function windowResized() {
  if(appState.mode === appState.modes.mobile){
    //resizeCanvas(windowWidth, windowHeight);
    //initializeAppUX();
  }
}
function keyPressed(){}




