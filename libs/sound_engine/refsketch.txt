//Faders
let pitchParam, decayParam, lfoRateParam, lfoDepthParam;
//Buttons
let oscWave, lfoWave;
let faders;

//Save, import, export UI
let downloadPatches, patchName, patchSelect, patchSaveButton, uploadPatch, setFineAdjust;

let listEmpty = true;

let fineAdjust = false;
const pitchShaper = quadShaperWithReverser(0.15, 8000, -1); //0.15, 8000
const lfoShaper = quadShaperWithReverser(0.05, 5000, -1);
const modDepthMult = 2000;
const decayMult = 5;

let userPatch = {
  name: "",
  voiceGain: 0.75,
  oscWave: "triangle",
  oscPitch: 400,
  //get oscPitch(){return (Math.random(-1, 1)*60-30) + 200},
  ampDecay: 0.5,//4.8,
  lfoRate: 500,
  lfoDepth: 200,//4000,
  lfoWave: "square",
};

function setup(){
  createCanvas(300, 300);
  rectMode(CENTER);  
  
  //Patch Handling UI
  patchName = new inputBox({posX:180, posY: 20, sizeX: 100});
  
  
  patchSelect = new dropDown({posX:180, posY: 60});
  patchSelect.addOption("-----empty-----")
  patchSelect.addListener((_value) => {
    let patch;
    for(const p of patches){
      if(p.name === _value){
        patch = p;
        break;
      }
    }
    loadPatch(patch);
  });
  
  patchSaveButton = new button({posX:180, posY:100, sizeX: 50, clickType: clickBehavior.press});
  patchSaveButton.addText('SAVE')
  patchSaveButton.addListener('onbuttonpress', savePatch);
  
  downloadPatches = new button({posX:180, posY:130, sizeX: 75, clickType: clickBehavior.press});
  downloadPatches.addText('DOWNLOAD');
  downloadPatches.addListener('onbuttonpress', () => {
    const patch = {...userPatch};
    downloadPatch(patch, patchSelect.getVal());
  });
  
  uploadPatches = new inputBox({posX:180, posY:160, sizeX: 65});
  //uploadPatches.addText('UPLOAD');
  uploadPatches.isFileInput();
  uploadPatches.addListener('change', uploadFiles);
  
  setFineAdjust = new button({posX:180, posY:220, sizeX: 75});
  setFineAdjust.addText('Fine Adjust');
  setFineAdjust.addListener('onbuttonpress', () => {
    fineAdjust = setFineAdjust.getState();
  });
  
  
  //SYNTH UI
  mySynth.patch1 = userPatch;
  
  pitchParam = pFader(createVector(20, 110), 'pitch'); 
  decayParam  = pFader(createVector(50, 110), 'decay');
  lfoRateParam  = pFader(createVector(100, 110), 'rate');
  lfoDepthParam  = pFader(createVector(130, 110), 'depth');
  faders = [pitchParam, decayParam, lfoRateParam, lfoDepthParam];
  
  oscWave = new buttonGroup({posX: 5, posY: 220, size: 20, layout: "horizontal"});
  oscWave.useIMG(['libs/temp_assets/sin.png', 'libs/temp_assets/tri.png', 'libs/temp_assets/sqr.png', 'libs/temp_assets/saw.png']);
  
  oscWave.addListener("ongroupchange", () => {
    userPatch.oscWave = ES1_OSC_TYPES[Object.keys(ES1_OSC_TYPES)[oscWave.getVal()]]
  });
  
  lfoWave = new buttonGroup({posX: 5, posY: 250, size: 20, layout: "horizontal", numButtons: 7});
  lfoWave.useIMG(['libs/temp_assets/sin.png', 'libs/temp_assets/tri.png', 'libs/temp_assets/sqr.png', 'libs/temp_assets/saw.png', 'libs/temp_assets/sandh.png', 'libs/temp_assets/noise.png', 'libs/temp_assets/env.png'])
  lfoWave.addListener("ongroupchange", () => {
    userPatch.lfoWave = ES1_LFO_TYPES[Object.keys(ES1_LFO_TYPES)[lfoWave.getVal()]]
  });
  
  loadPatch(userPatch);
}

function draw(){
  //fineAdjust = keyIsDown(32);
  background(80,100,200)
  faders.forEach((fader) => {
    fader.update();
    fader.render();
  });
  //console.log(fadder.shapedValue(expShaper));
  userPatch.oscPitch = pitchParam.shapedValue(pitchShaper.shaper);
  userPatch.ampDecay = decayParam.value * decayMult;
  userPatch.lfoDepth = lfoDepthParam.value * modDepthMult; //800
  userPatch.lfoRate = lfoRateParam.shapedValue(lfoShaper.shaper);
  
  noFill();
  rect(40, 110, 70, 200)
  rect(115, 110, 70, 200)
  fill(30, 100);
  rect(235, 100, 120, 180)
  
  fill(0)
  text("OSC", 25, 25);
  text("MOD", 100, 25);
  
  text("OSC TYPE", 110, 235);
  text("MOD TYPE", 190, 265);
}

function mousePressed(){
  faders.forEach((fader) => {fader.collisionCheck({x: mouseX, y: mouseY})});
}

function keyPressed(){
  mySynth.playVoice1(audioContext.currentTime + audioContext.baseLatency);
}

function mouseReleased(){
  //fadder.clicked = false;
}

function loadPatch(_patch){
  //Set UI Elements
  oscWave.setVal(getPropNumByValue(ES1_OSC_TYPES, _patch.oscWave));
  lfoWave.setVal(getPropNumByValue(ES1_LFO_TYPES, _patch.lfoWave));
  pitchParam.value = pitchShaper.reverse(_patch.oscPitch); 
  decayParam.value = _patch.ampDecay/decayMult;
  lfoRateParam.value = lfoShaper.reverse(_patch.lfoRate);
  lfoDepthParam.value  = _patch.lfoDepth/modDepthMult;
}


function savePatch(_name){
  if(listEmpty){
    listEmpty = false;
    patchSelect.reset();
  }
  const patch = {...userPatch};
  patch.name = _name ? _name : patchName.getVal();
  patches.push(patch);
  patchSelect.addOption(patch.name);
  patchSelect.setVal(patch.name);
}

function pFader(_pos, _name){
  //State
  let clicked = false;
  let clickPos = createVector();
  
  //Position + Orientation
  let orientation = "vertical"; //"horizontal"
  let handleColType = "rect"; //"circle
  let pos = _pos
  let handlePos = -25;
  let length = 150;
  let width = 20;
  
  //Render Data
  //color
  //track stroke
  //track stroke width
  let trackStrokeWidth = 4;
  //handle fill
  //handle stroke width
  //Handle Data
  
  //Setup handle collider data (so we dont clutter all other functions with ifs about orientation)
  let handle;
  
  if(handleColType === "rect"){
    handle = {
      h: orientation === "vertical" ? width/2 : width-4,
      w: orientation === "vertical" ? width-4 : width/2,
      get renderOffsetY() {return orientation === "vertical" ? length/2 + trackStrokeWidth/2 -this.w/8 + handlePos : 0},
      get renderOffsetX() {return orientation === "horizontal" ? length/2 + trackStrokeWidth -this.h/8 + handlePos : 0},
      get bounds(){
        return {
          xMin: (pos.x + this.renderOffsetX) - this.w/2,
          xMax: (pos.x + this.renderOffsetX) + this.w/2,
          yMin: (pos.y + this.renderOffsetY) - this.h/2,
          yMax: (pos.y + this.renderOffsetY) + this.h/2
        }
      }
    }
  }
  
  function render(){
    //Track
    strokeWeight(4)
    line(pos.x, pos.y-length/2, pos.x, pos.y+length/2);
    
    //Handle
    strokeWeight(2)
    if(handleColType === "rect"){
      fill(20, 49, 39);
      rect(pos.x + handle.renderOffsetX, pos.y + handle.renderOffsetY, handle.w, handle.h);
    }
    const val = Math.round((-handlePos/length) * 100)/100;
    //text(("value: " + val), pos.x-24, pos.y + length/2 + 24)
    text(_name, pos.x-14, pos.y + length/2 + 20)
  }
  
  function collisionCheck(_pt){
    if(_pt.x > handle.bounds.xMin && _pt.x < handle.bounds.xMax && _pt.y > handle.bounds.yMin && _pt.y < handle.bounds.yMax){
      clicked = true;
      clickPos.set(mouseX, mouseY);
    }
  }
  
  function update(){
    if(!mouseIsPressed) clicked = false;
    if(!clicked) return;
    if(orientation === "vertical") {
      if(fineAdjust){
        handlePos = clampToRange(handlePos += Math.sign(mouseY-clickPos.y) * 0.1, -length, 0);
        return;
      }
      handlePos = clampToRange(mouseY-pos.y-length/2,-length, 0);
    }
  }
  
  function shapedValue(_shaper){
    return(_shaper(this.value));
  }
  
  return {
    get render(){return render},
    get collisionCheck(){return collisionCheck},
    get update(){return update},
    get value(){return -handlePos/length},
    set value(_val){handlePos = -_val*length},
    get shapedValue(){return shapedValue}
  }
}


//https://www.tutorialspoint.com/How-to-calculate-the-nth-root-of-a-number-in-JavaScript#:~:text=In%20summary%2C%20there%20are%20multiple,root%20you%20want%20to%20calculate.
function nRoot(_base, _root){return Math.pow(_base, 1/_root)}

function reverseShaper(_value, _exponent, _range, _offset){
  _value = (_value + _offset) / _range;
  return 1-nRoot(1-_value, _exponent);
}


function clampToRange(_num, _min, _max){return Math.min(Math.max(_num, _min), _max)}

function quadratic(_x, _exp) {return 1 - Math.pow(1 - _x, _exp)}

function QuadraticShaper(_exponent, _range, _offset){
  return function(_x){return quadratic(_x, _exponent) * _range-_offset}
}

function quadShaperWithReverser(_exponent, _range, _offset){
  return {
    shaper: QuadraticShaper(_exponent, _range, _offset),
    reverse: function(_value){
      return reverseShaper(_value, _exponent, _range, _offset);
    }
  }
}

//https://www.geeksforgeeks.org/how-to-get-a-key-in-a-javascript-object-by-its-value/
function getKeyByValue(_obj, _val){
  for(const prop in _obj) {
    if(_obj[prop] === _val) return prop;
  }
}

function getPropNumByValue(_obj, _value){
  let num = 0;
  for(const prop in _obj) {
    if(_obj[prop] === _value) return num;
    num++;
  }
}

