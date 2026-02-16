let rotationTester;


function setup() {
  createCanvas(300, 300);
  rectMode(CENTER);
  textAlign(CENTER);
  rotationTester = createRotationTester();

}

function draw() {
  background(240);
  rotationTester.update();
}

function mousePressed(){
  let fs = fullscreen();
  fullscreen(!fs);
}



function createRotationTester(){
  
  const rects = [];

  let red = color(255, 0, 0);
  let green = color(0, 255, 0);
  let blue = color(0, 0, 255);
  
  rects.push(makeRect("x", red));
  rects.push(makeRect("y", green));
  rects.push(makeRect("z", blue));


  const currentOrientation = {
    x: 0,
    y: 0,
    z: 0
  }
  
  //https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Using_device_orientation_with_3D_transforms
  /*The easiest way to convert orientation data to a 3D transform 
  is basically to use the alpha, gamma, and beta values as rotateZ, 
  rotateX and rotateY values.*/
  
  window.addEventListener("deviceorientation", (ev)=> {
    currentOrientation.z = ev.alpha; // 0 (inclusive) to 360 (exclusive)
    currentOrientation.x = ev.gamma; //-90 (inclusive) to 90 (exclusive). This represents a left to right motion of the device.
    currentOrientation.y = ev.beta; // -180 (inclusive) to 180 (exclusive). This represents a front to back motion of the device.
  });
  
  function makeRect(axis, rectColor){
    let posY = 0;
    let posX = 0;
    let mult = 0.5;
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
      text(val, posX + offset, height/2 + 20)
    }

    function update(){
      switch(axis){
        case "x":
          posY = ((currentOrientation.x + 90) * 2) * mult;
          val = Math.floor(currentOrientation.x * 100)/100;
          break;
        case "y":
          posY = (currentOrientation.y + 180) * mult;
          posX = 70;
          val = Math.floor(currentOrientation.y * 100)/100;
          break;
        case "z":
          posY = currentOrientation.z * mult;
          posX = 140;
          val = Math.floor(currentOrientation.z * 100)/100;
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