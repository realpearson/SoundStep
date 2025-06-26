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
  infiniteSustain: false,
};

//ES-Module
function createES1(){
  let patch1 = defaultEs1Voice;
  const voice1 = createVoiceHandler(ES1_Voice, 1);
  function playVoice1(_time){voice1.play(_time, patch1)}
  return {
    get playVoice1(){return playVoice1},
    get stop(){return voice1.stop},
    get applyDynamicPatchChange(){return voice1.applyDynamicPatchChange},
    get patch1(){return patch1},
    set patch1(_patch){patch1 = _patch}
  }
}


//Dynamic Params (can be set while voice active)
//-osc wave
//-osc freq
//-lfo wave
//-lfo freq
//-lfo depth
//-master gain

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


  function setupModWave(_wave){
    switch(_wave){
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
  }

  


  const oscMod = new OscillatorNode(audioContext);
  oscMod.start();

  const noiseMod = new AudioWorkletNode(audioContext, 'sample-hold-gen'); //For dynamic control instantiate regardless if in patch
  let noiseRate = noiseMod.parameters.get("rate");
  //noiseMod.start();
  

  setupModWave(_patch.lfoWave);


  function setupEnv(){
    osc.frequency.exponentialRampToValueAtTime(_patch.oscPitch/(_patch.lfoDepth/30 + 0.1), time + _patch.lfoRate/100);
    modulator = null;
  }
  
  function setupOscMod(){
    /*
    modulator = new OscillatorNode(audioContext, {
      type: _patch.lfoWave,
      frequency: _patch.lfoRate
    });
    */
   osc.frequency.setValueAtTime(_patch.oscPitch, audioContext.currentTime);
   modulator?.disconnect();
   modulator = oscMod;
   modulator.frequency.value = _patch.lfoRate;
   modulator.type = _patch.lfoWave;
   modulator.connect(modAmt);
  }
  
  function setupNoiseMod(){
    //CREATE WRAPPER FOR CUSTOM WORKLET PROCESSORS W/ relevant functions, release, etc...
    //modulator = new AudioWorkletNode(audioContext, 'sample-hold-gen'); //{processorOptions: {interval: "random", interpolate: true}}
    osc.frequency.setValueAtTime(_patch.oscPitch, audioContext.currentTime);
    modulator?.disconnect();
    modulator = noiseMod;
    if(_patch.lfoWave === ES1_LFO_TYPES.NOISE) modulator.port.postMessage({interpolate: true});
    else modulator.port.postMessage({interpolate: false})
    noiseRate.value = _patch.lfoRate;
    modulator.connect(modAmt);
  }


  //Connection, Route modulation 
  //if(modulator.connect) modulator.connect(modAmt);
  modAmt.connect(osc.frequency);
  osc.connect(vca);
  vca.connect(master);
  master.connect(audioContext.destination);

  //Start generators, set dynamic value modulations
  vca.gain.linearRampToValueAtTime(0.5, time);
  if(!_patch.infiniteSustain) vca.gain.exponentialRampToValueAtTime(0.00001, time + _patch.ampDecay + 0.001);
  
  osc.start();
  if(!_patch.infiniteSustain) osc.stop(time + _patch.ampDecay);
  osc.onended = release;
  //if(modulator.start) modulator.start(); //Need to start on initilize for dynamic control

  //Controls 
  function changePitch(){
    //do thing
  }

//-lfo freq

  function applyDynamicPatchChange(_newVals){
    if(_newVals.oscWave) osc.type = _newVals.oscWave;
    if(_newVals.oscPitch) osc.frequency.setValueAtTime(_newVals.oscPitch, audioContext.currentTime);
    if(_newVals.voiceGain) master.gain.value = _newVals.voiceGain;
    if(_newVals.lfoDepth) modAmt.gain.value = _newVals.lfoDepth;
    if(_newVals.lfoWave || _newVals.lfoRate != undefined) {
      _patch.lfoRate = _newVals.lfoRate ?? _patch.lfoRate;
      setupModWave(_newVals.lfoWave);
    }

  }


  
  let timoutID;
  
  function stop(){
    //A little extra work to prevent pops and clicks
    const stopTime = audioContext.currentTime;// + audioContext.baseLatency;
    master.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.01);
    osc.stop(stopTime + 0.011);
    done = true;
  }

  function release(){
    modulator = null;
    //noiseMod.stop();
    noiseMod.port.postMessage({nodeActive: false});
    noiseMod.port.close();
    noiseMod.disconnect();

    oscMod.stop();
    oscMod.disconnect();
    master.disconnect();
    done = true;
    osc = vca = master = modAmt = modulator = null;
  }
    
  return {
    get done(){return done},
    get stop(){return stop},
    get applyDynamicPatchChange(){return applyDynamicPatchChange},
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