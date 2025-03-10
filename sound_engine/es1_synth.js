//ES1 Patches + Resources
const ES1_LFO_TYPES = {SINE: "sine", TRIANGLE: "triangle", SQUARE: "square", SAW: "sawtooth", SAMPLE_HOLD: "sample_hold", NOISE: "noise", ENVELOPE: "envelope"};

const ES1_OSC_TYPES = {SINE: "sine", TRIANGLE: "triangle", SQUARE: "square", SAW: "sawtooth"};

let defaultEs1Voice = {
  name: "",
  voiceGain: 0.75,
  oscWave: "triangle",
  //oscPitch: 400,
  get oscPitch(){return (Math.random(-1, 1)*60-30) + 200},
  ampDecay: 0.5,//4.8,
  lfoRate: 20,
  lfoDepth: 20,//4000,
  lfoWave: "square",
};

//ES-Module
function createES1(){
  let patch1 = defaultEs1Voice;
  const voice1 = createVoiceHandler(ES1_Voice, 1);
  function playVoice1(_time){voice1.play(_time, patch1)}
  return {
    get playVoice1(){return playVoice1},
    get patch1(){return patch1},
    set patch1(_patch){patch1 = _patch}
  }
}

//ES-1 Voice
function ES1_Voice(time, _patch) {
  let done = false;
  
  //DEFINE NODE VARS
  //let osc, vca, master, modAmt, modulator
  
  //INSTANTIATE & INITIALIZE
  
  //VCO
  let osc = new OscillatorNode(audioContext, {
    type: _patch.oscWave,
    frequency: _patch.oscPitch
  });

  //VCA
  let vca = new GainNode(audioContext, {gain: 0});
  
  //Volume
  let master = new GainNode(audioContext, {gain: _patch.voiceGain});
  
  //Modulator (initialized later)
  let modulator;
  
  //Mod Gain
  let modAmt = new GainNode(audioContext, {gain: _patch.lfoDepth});


  switch(_patch.lfoWave){
    case ES1_LFO_TYPES.ENVELOPE:
      setupEnv();
      break;
    case ES1_LFO_TYPES.NOISE:
    case ES1_LFO_TYPES.SAMPLE_HOLD:
      setupNoiseMod();
      break;
    default:
      setupOscMod();
      break;
  }
  
  function setupEnv(){
    osc.frequency.exponentialRampToValueAtTime(_patch.oscPitch/(_patch.lfoDepth/30 + 0.1), time + _patch.lfoRate/100);
    modulator = {};
  }
  
  function setupOscMod(){
    modulator = new OscillatorNode(audioContext, {
      type: _patch.lfoWave,
      frequency: _patch.lfoRate
    });
  }
  
  function setupNoiseMod(){
    //CREATE WRAPPER FOR CUSTOM WORKLET PROCESSORS W/ relevant functions, release, etc...
    modulator = new AudioWorkletNode(audioContext, 'sample-hold-gen'); //{processorOptions: {interval: "random", interpolate: true}}
    let noiseRate = modulator.parameters.get("rate");
    if(_patch.lfoWave === ES1_LFO_TYPES.NOISE) modulator.port.postMessage({interpolate: true});
    noiseRate.value = _patch.lfoRate;
  }


  //Connection, Route modulation 
  if(modulator.connect) modulator.connect(modAmt);
  modAmt.connect(osc.frequency);
  osc.connect(vca);
  vca.connect(master);
  master.connect(audioContext.destination);

  //Start generators, set dynamic value modulations
  vca.gain.linearRampToValueAtTime(0.5, time);
  vca.gain.exponentialRampToValueAtTime(0.00001, time + _patch.ampDecay + 0.001);
  
  osc.start();
  osc.stop(time + _patch.ampDecay);
  osc.onended = release;
  if(modulator.start) modulator.start();

  //Controls 
  function changePitch(){
    //do thing
  }
  
  let timoutID;
  
  function stop(){
    //A little extra work to prevent pops and clicks
    const stopTime = audioContext.currentTime + audioContext.baseLatency;
    master.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.01);
    done = true;
  }

  function release(){ 
    if(modulator.stop) modulator.stop();
    if(modulator.port){
      modulator.port.postMessage({nodeActive: false});
      modulator.port.close();
    }
    if(modulator.disconnect) modulator.disconnect();
    master.disconnect();
    done = true;
    osc = vca = master = modAmt = modulator = null;
  }
    
  return {
    get done(){return done},
    get stop(){return stop}
  }
}


/*
//Setting up worklet node and parameters after we load the module

  let gainWorkletNode = new AudioWorkletNode(audioContext, 'sample-hold-gen'); //{processorOptions: {interval: "random", interpolate: true}}
  gainWorkletNode.port.postMessage({interpolate: false});
  let rateParam = gainWorkletNode.parameters.get("rate");
  rateParam.value = 44;
  rateParam.setValueAtTime(2, audioContext.currentTime);
*/