let rotationTester;


function setup() {

  rotationTester = createRotationTester();
  
  document.getElementById("permissions").addEventListener("mousedown", ()=> {
    requestPreventScreenLock();
  });
}

function draw() {
  background(240);
  rotationTester.update();
}

function mousePressed(){
  let fs = fullscreen();
  fullscreen(!fs);
  cnv.center();
}

function createCompassApp(){
  //Create a little sonic compass app. Use 4 tones that represent cardinal directions and blend between tones for intermediate angles.
}

function createRotationTester(){
  
  const rects = [];

  let red = color(255, 0, 0);
  let green = color(0, 255, 0);
  let blue = color(0, 0, 255);
  
  rects.push(makeRect("x", red));
  rects.push(makeRect("y", green));
  rects.push(makeRect("z", blue));

  let canvasElement = document.getElementById("device_test_canvas");
  let cnv = createCanvas(300, 300, canvasElement);
  cnv.center();
  rectMode(CENTER);
  textAlign(CENTER);

  
  function makeRect(axis, rectColor){
    let posY = 0;
    let posX = 0;
    let mult = 0.25;
    let offset = 80;
    let val;
    let rawVal;

    function render(){
      strokeWeight(1);
      stroke(0);
      fill(rectColor);
      rect(posX + offset, height/2 + posY, 50, 50);
      strokeWeight(2);
      fill(0);
      text(axis, posX + offset, height/2 + posY);
      noStroke();
      //text(val, posX + offset, height/2 + posY + 20)
      text(val, posX + offset, height/2 + 20 + posY)
    }

    function update(){
      switch(axis){
        case "x":
          posY = ((deviceSensorHandler.rotationX + 90) * 2) * mult;
          val = Math.floor(deviceSensorHandler.rotationX * 100)/100;
          break;
        case "y":
          posY = (deviceSensorHandler.rotationY + 180) * mult;
          posX = 70;
          val = Math.floor(deviceSensorHandler.rotationY * 100)/100;
          break;
        case "z":
          posY = deviceSensorHandler.rotationZ * mult;
          posX = 140;
          val = Math.floor(deviceSensorHandler.rotationZ * 100)/100;
          break;
      }
    }

    return {
      render,
      update
    }
  }
  
  
  
  return {
    update: function (){
      rects.forEach((r) => r.update());
      rects.forEach((r) => r.render());
    },
  }
  
}


/* Add this
DeviceOrientationEvent.absolute Read only
A boolean that indicates whether or not the device is providing orientation data absolutely.
 */