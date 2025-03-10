//https://loophole-letters.vercel.app/web-audio-scheduling#conclusion
//https://mmckegg.github.io/web-audio-school/

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
let modulesLoaded = false;

//-----------------------VOICE HANDLER-----------------------
const STEAL_MODE = { OLDEST: "OLDEST", QUIETEST: "QUIETEST", NONE: "NONE" }; //Distance

function createVoiceHandler(_voice, _polyphony, _stealMode){
  let voice = _voice;
  let polyphony = _polyphony || 1;
  let stealMode = _stealMode || STEAL_MODE.OLDEST;
  const activeVoices = [];
  
  function play(_time, _patch){
    activeVoices.forEach((_voice, _index) => {
      
      if(_voice.done) activeVoices.splice(_index, 1)
      if(_voice.done && _index == 0) activeVoices.length = 0;
      if(_index >= polyphony-1 && !_voice.done) {
        _voice.stop();
        activeVoices.splice(_index, 1) 
      }
      
    });

    activeVoices.splice(0, 0, voice(_time, _patch));
  }
  
  return {
    get polyphony(){return polyphony},
    set polyphony(_val){polyphony = _val},
    set voice(_voice){voice = _voice},
    get play(){return play},
    get activeVoices(){return[...activeVoices]}
  }
}

function loadAudioModule(_context){
  _context.audioWorklet.addModule('synth_engine/audio_processors.js').then(() => {
    modulesLoaded = true;
    //WE could add all the initializer functions here
  });
}

loadAudioModule(audioContext);






















