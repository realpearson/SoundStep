let audioCtx = new AudioContext();

//https://editor.p5js.org/unofficial/sketches/nR7TJ8dbv
const loadSoundData = (_address, _ctxt, _sound) => {
  const request = new XMLHttpRequest();
  request.open('GET', _address);
  request.responseType = 'arraybuffer';
  request.onload = function(){
    let rawAudio = request.response;
    _ctxt.decodeAudioData(rawAudio, (data)=> _sound.setBuffer(data));
  };
  request.send();
}


let soundContainer = function (_address, _ctxt) {
  let address = _address;
  let ctxt = _ctxt;
  let buffer = null;
  let gain = 1;
  let node;
  
  loadSoundData(address, ctxt, this);
  
  this.play = (_time, _speed, _offset)=> {
    _time = _time || 0;
    _speed = _speed || 1;
    const amp = new GainNode(ctxt, {gain});
    const source = ctxt.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = _speed;
    source.connect(amp);
    if(node != undefined) amp.connect(node);
    else amp.connect(ctxt.destination);
    //const offset = _offset || 0;
    source.start(ctxt.currentTime + _time, source.buffer.duration * (_offset||0));
    return source;
  }
  
  this.connect = (_node) => {
    if(_node != undefined && _node.hasOwnProperty('input')) node = _node;
    else throw Error('Not a valid node');
  }
  
  this.setBuffer = (_data) => {
    buffer = _data;
  }

  this.setGain = (_gain) => {
    gain = _gain;
  }
}


function createRandomizer(sounds){
  const soundContainers = [];

  let prevIndex = 0;

  sounds.forEach((sound) => {
    soundContainers.push(new soundContainer(sound, audioCtx))
  });

  function playRandom(time, speed, offset){
    let ind = Math.floor(Math.random()*soundContainers.length);
    if(ind === prevIndex) ind = ind > 0 ? ind-1 : ind+1;
    prevIndex = ind;
    soundContainers[ind].play(time || 0, speed || 1, offset || 0);
  }

  function playSequence(time, speed, offset){
    soundContainers[prevIndex].play(time || 0, speed || 1, offset || 0);
    if(prevIndex < soundContainers.length-1) prevIndex++;
    else prevIndex = 0;
  }

  return {
    get playRandom(){return playRandom},
    get playSequence(){return playSequence},
    get setAmp(){return (amp) => {
      soundContainers.forEach((container) => {container.setGain(amp)});
    }}
  }
}

/*
//NEW AUDIO LOADER/ SOURCE DEAL
async function loadAudioData(buffer, fileAddress, context){
  try {
    const response = await fetch(fileAddress);
    buffer = await context.decodeAudioData(await response.arrayBuffer());
  } catch(err) {
    console.error("Audio load error: " + err.message);
  }
}

function createBufferList(){
  const buffers = [];
  
  return {
    get addBuffer()
  }
}

function createVoice(buffer, context){
  return {

  }
}
  */



//https://editor.p5js.org/unofficial/sketches/3SL7BmS_a
let MultiEnv = function(_ctxt) {
  //For handling exponential ramps to and from 0
  const NonZero = 0.0001;
  const ExpRolloffTime = 0.2;
  
  let minVal = 0;
  let startVal = minVal;
  let ctxt = _ctxt;
  let param = [];
  //let exponential = false;
  let steps = [];
  let currentStep = 0;


  this.addStep = function(_params) {
    if(!_params || _params.time == undefined || _params.val == undefined) throw Error('Add Step requires a time and value');
    const stp = {
      time: _params.time,
      val: _params.val,
      sustain: _params.sustain ?? false,
      exp: _params.exp ?? true,
      name: _params.name || 'step' + steps.length
    }
    steps.push(stp);
    return stp.name;
  }

  //_step, _time, _val, _sustain, _exp
  this.setStep = function(_params) {
    let stp = steps[getStepByName(_params.name)];
    stp.time = _params.time || stp.time;
    stp.val = _params.val || stp.val;
    stp.sustain = _params.sustain ?? stp.sustain;
    stp.exp = _params.exp ?? stp.exp;
  }
  
  let getStepByName = function(_name){
    if(_name == undefined) throw Error('No step name provided (undefined)');
    
    for(let i = 0; i < steps.length; i++){
      if(steps[i].name == _name) return i;
    }
    
    throw Error('No step matching name: ' + _name);
  }

  this.jumpToStep = function(_name){
    currentStep = getStepByName(_name);
  }
  
  this.setStartVal = function(_val) {
    startVal = _val;
  }

  this.setMinVal = function(_val) {
    minVal = _val;
  }

  this.trigger = function(_time) {
    //if (ctxt == undefined) ctxt = getAudioContext();
    if (steps.length < 1) throw Error('You must add at least 1 step to trigger MultiEnv');
    let t = _time || 0;

    let envStep = steps[currentStep];
    let startLevel = currentStep == 0 ? startVal : steps[currentStep - 1].val + startVal;

    const now = ctxt.currentTime;
    param.forEach(p => {
      //p.cancelScheduledValues(now);
      p.cancelAndHoldAtTime(now + t);
      p.setValueAtTime(startLevel, now + t);
      
    });

    let totTime = 0;
    let prevVal = startLevel;

    for (let i = currentStep; i < steps.length; i++) {

      let stp = steps[i];
      let val = startLevel + stp.val < minVal ? minVal : startVal + stp.val;
      const timeTo = now + totTime + stp.time + t;

      param.forEach(p => {
        if (stp.exp) {
          if(Math.abs(val) < NonZero/100000){
            p.exponentialRampToValueAtTime(NonZero, timeTo); //Catch exp ramping down to 0
            p.setTargetAtTime(0, timeTo, ExpRolloffTime);
          } else if(Math.abs(prevVal) < NonZero/100000){
            p.setValueAtTime(NonZero, now + t); //Catch exp ramping up from 0
            p.exponentialRampToValueAtTime(val, timeTo); 
          }
          else p.exponentialRampToValueAtTime(val, timeTo); //Normal exp ramp
        }
        else p.linearRampToValueAtTime(val, timeTo); //Linear ramp
      });

      totTime += stp.time;
      prevVal = val;
      currentStep = i;

      if (stp.sustain) {
        currentStep = i < steps.length-1 ? i + 1 : 0; //-1?
        return;
      } else if (currentStep == steps.length - 1) currentStep = 0;
    }
  }

  this.getNumSteps = function() {
    return steps.length;
  }

  this.reset = function() {
    currentStep = 0;
  }

  this.clear = function() {
    steps.length = 0;
  }

  this.connect = function(_param) {
    param.push(_param);
  }

  this.disconnect = function() {
    param.length = 0;
  }
};