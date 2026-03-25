const appDiv = document.getElementById("AppView");
const appCanvas = document.getElementById("appCnv");
const desktopDiv = document.getElementById("DesktopView");
const desktopCanvas = document.getElementById("desktopCnv");

//https://getcssscan.com/css-buttons-examples
//https://www.fasttalklabs.com/physiology/how-to-analyze-running-form/
const permissionsButton = document.getElementById("permissionsButton");

if (typeof DeviceMotionEvent === "undefined" || typeof DeviceMotionEvent.requestPermission !== "function"){
    alert("not iOS");
    permissionsButton.hidden = true;
    document.getElementById("AppView").hidden = false;

} else {
    alert("iOS");
    permissionsButton.addEventListener("mousedown", requestSensorPermission, {once: true});

    permissionsButton.addEventListener("pointerdown", ()=> {
        permissionsButton.hidden = true;
        document.getElementById("AppView").hidden = false;
    });
}


function draw() {
    let ready = false;
    if(!ready && permissionState === "Not Needed" || permissionState === "Granted"){
        createCanvas(window.innerWidth, window.innerHeight, appCanvas);
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








