//Store all raw data -> divide into processing buffers -> process data
//SessionData=(globals/everything) -> processing buffers
//Press record-> Create session, create global data, create raw data, map to processing buffers


function createSession(name){
  let globalData = null;
  
  const sessionData = [];
  const processors = [];
  
  function recordData(data, debug){
    
    if(globalData === null) {
      globalData = {sessionName: name||'', 
                    date: Date.now(), 
                    t0: performance.now(), 
                    audioOutputLatency: audioCtx.outputLatency,
                   }
    }


    sessionData.push({
      timestamp: performance.now(),
      acceleration: {x:data.acceleration?.x, y:data.acceleration?.y, z:data.acceleration?.z},
      rotation: {x:data.rotation?.x, y:data.rotation?.y, z:data.rotation?.z},
      metaData: {}
    });
        
    processors.forEach((p) => {
      p.processor.analyzeRealtime(data[p.sensorType][p.axis], debug);
    });
    
  }
  
  function connectRealtimeProcessor(processor, sensorType, axis){
    processors.push({processor, sensorType, axis});
  }
  
  return {
    //Rename session to data, have to keep for now to make JSON work...
    set globalData(val){globalData = val},
    get sessionData(){return {global: globalData, session: [...sessionData]} },
    get recordData(){return recordData},
    get connectRealtimeProcessor(){return connectRealtimeProcessor},
    get clearRealtimeProcessors(){return () => processors.length = 0}
  }
}



//---------------------------------Data Processing & Analyzers-------------------------------------

const defaultPeakSettings = {
  framesUntilPeakConfirm: 3,
  frameCooldownThresh: 10,
  hiMode: {peakThresh: 5, resetThresh: 1},
  loMode: {peakThresh: -5, resetThresh: -1},
}

function createPeakAnalyzer(peakAnalyzerSettings, listeners){
  
  //Events
  let onHiPeakEvents = listeners?.onHiPeakEvents || [];
  let onLoPeakEvents = listeners?.onLoPeakEvents || [];
  
  //Peak Detection Settings
  const framesUntilPeakConfirm = peakAnalyzerSettings.framesUntilPeakConfirm;
  //const frameCooldownThresh =  peakAnalyzerSettings.frameCooldownThresh;
  const hiMode = peakAnalyzerSettings.hiMode;
  const hiPeakThresh = peakAnalyzerSettings.hiMode?.peakThresh;
  const hiResetThresh = peakAnalyzerSettings.hiMode?.resetThresh;
  const loMode = peakAnalyzerSettings.loMode;
  const loPeakThresh = peakAnalyzerSettings.loMode?.peakThresh;
  const loResetThresh = peakAnalyzerSettings.loMode?.resetThresh;

  let debug = false;

  //Internal Buffers
  let prevPeakDir = 0;
  let maxVal = 0;
  let minVal = 0;
  let peakCandidateIndex = -1;
  let framesSincePeakCandidate = 0;
  let framesSincePrevPeak = 0;
  
  //Incremented buffers
  let index;
  let val;

  //Data
  let data = [];
  let peakData = [];

  function checkForHiPeak(){
    if(!hiMode) return;
    if(val < hiPeakThresh || val <= maxVal || prevPeakDir > 0) return;
    //Catch rapid polarity shifts
    if(peakCandidateIndex >= 0 && data[peakCandidateIndex] < 0) confirmPeak();
    //We have exceded current peak candidate, set new
    if(debug) console.log(`hiC, val: ${val}, index: ${index}, pMax: ${maxVal}`);
    maxVal = val;
    peakCandidateIndex = index;
    framesSincePeakCandidate = 0;
  }
  
  function checkForLoPeak(){
    if(!loMode) return;
    if(val > loPeakThresh || val >= minVal || prevPeakDir < 0) return;
    //Catch rapid polarity shifts
    if(peakCandidateIndex >= 0 && data[peakCandidateIndex] > 0) confirmPeak();
    //We have exceded current peak candidate, set new
    if(debug) console.log(`loC, val: ${val}, index: ${index}, pMin: ${minVal}`);
    minVal = val;
    peakCandidateIndex = index;
    framesSincePeakCandidate = 0;
  }
  
  function resetBuffer(){    
    if(debug) console.log("reset min, max, dir")
    minVal = 0;
    maxVal = 0;
    prevPeakDir = 0;
  }
  
  function confirmPeak(){
    const peakObj = data[peakCandidateIndex];
    const polarity = Math.sign(peakObj);
    
    peakData[peakCandidateIndex].isPeak = true;
    
    //FIRE EVENTS
    //other data like time since previous peak?
    if(polarity > 0) onHiPeakEvents.forEach((ev) => ev(peakObj));
    else onLoPeakEvents.forEach((ev) => ev(peakObj));
    
    if(debug) console.log(`peak confirm: ${peakObj}, index: ${peakCandidateIndex}`);
    //Reset & Set Buffers
    prevPeakDir = polarity;
    peakCandidateIndex = -1;
    framesSincePrevPeak = 0;
  }
  
  function incrementFramesPrevPeak(){
    if(debug) console.log(`val: ${val}, index: ${index}, pDir: ${prevPeakDir}, peakCInd: ${peakCandidateIndex}`);
    framesSincePrevPeak++;
  }
  
  function calcCooldowns(){
    if(hiMode && prevPeakDir < 0) {
      if(val < hiResetThresh) if(peakCandidateIndex >= 0) confirmPeak();
    } else if(loMode && prevPeakDir > 0){
      if(val > loResetThresh) if(peakCandidateIndex >= 0) confirmPeak();
    }

    if(hiMode && prevPeakDir > 0 && val < hiResetThresh) resetBuffer();
    else if(loMode && prevPeakDir < 0 && val > loResetThresh)resetBuffer();
  }
  
  function checkPeakConfirm(){
    if(peakCandidateIndex >= 0){
      framesSincePeakCandidate++;
      if(framesSincePeakCandidate >= framesUntilPeakConfirm) confirmPeak();
    }
  }

  function resetProcessor(){
    resetBuffer();
    peakCandidateIndex = -1;
    framesSincePeakCandidate = 0;
    framesSincePrevPeak = 0;
    data.length = 0;
    peakData.length = 0;
    index = 0;
  }
  
  return {
    get analyzeRealtime(){return (dataPoint, debugMode) => {
      debug = debugMode;
      data.push(dataPoint);
      peakData.push({value: dataPoint});
      index = data.length-1;
      val = dataPoint;
      incrementFramesPrevPeak();
      checkForHiPeak();
      checkForLoPeak();
      calcCooldowns();
      checkPeakConfirm();
    }},
    
    get analyzeOffline(){return (data) => {
      for(let i = 0; i < data.length; i++){
        this.analyzeRealtime(data[i]);
      }
    }},
    
    get data(){return peakData},
    get resetProcessor(){return resetProcessor}
  }
}

function createDataBucket(){
  const bucket = [];

  return {
    get analyzeRealtime(){return (dataPoint) => bucket.push({value: dataPoint})},
    get data(){return bucket},
    get resetProcessor(){return () => bucket.length = 0}
  }
}


const defaultZeroCrossingSettings = {
  resetThreshold: 4,
  zeroCrossingThreshold: 0.1
}

function createZeroCrossingAnalyzer(zeroCrossSettings, listeners){
  //Value within 0 threshold
  //Reset threshold gate (avoid multiple triggers)
  //value changes polarity

  const resetThreshold = zeroCrossSettings.resetThreshold;
  //const zeroCrossingThreshold = zeroCrossSettings.zeroCrossingThreshold;
    
  //Incremented buffers
  let index;
  //let val;

  //Data
  const data = [];
  const zeroCrossingData = [];

  let zeroCrossingCandidateIndex = -1;
  let resetMet = false;
  //let trending = 0;

  function analyze(){
    if(data.length < 2) return;
    if(!resetMet && Math.abs(data[index]) < resetThreshold) return;
    else resetMet = true;

    //Zero crossing between frames
    if(resetMet && (Math.sign(data[index]) != Math.sign(data[index-1]))){
      if(Math.abs(data[index]) < Math.abs(data[index-1])) zeroCrossingCandidateIndex = index;
      else zeroCrossingCandidateIndex = index-1;
      confirmZeroCrossing();
    }

    //The rest of this algorithm would really just be the edge case where we reach the threshold
    //but switch directions before the polarity of the value changes.
    //Good to have but skipping for now....
    //let trending = Math.sign(data[index]-data[index-1]);
  }

  function confirmZeroCrossing(){
    //console.log(`index: ${data[index]} index-1: ${data[index-1]}`);
    resetMet = false;
    zeroCrossingData[zeroCrossingCandidateIndex].isZeroCrossing = true;
    zeroCrossingCandidateIndex = -1;
    listeners?.forEach((listener) => {listener()});
  }

  function resetProcessor(){
    index = 0;  
    data.length = 0;
    zeroCrossingData.length = 0;;
    zeroCrossingCandidateIndex = -1;
    resetMet = false;
  }

  return {
    get analyzeRealtime(){return (dataPoint, debugMode) => {
      debug = debugMode;
      data.push(dataPoint);
      zeroCrossingData.push({value: dataPoint});
      index = data.length-1;
      val = dataPoint;
      analyze();
    }},
    
    get analyzeOffline(){return (data) => {
      for(let i = 0; i < data.length; i++){
        this.analyzeRealtime(data[i]);
      }
    }},
    
    get data(){return zeroCrossingData},
    get resetProcessor(){return resetProcessor}
  }
}

function createTempoAnalyzer(settings, listeners){
  //Output:
  //time since last step
  //avg time over last X steps
  //avg time total
  //estimated BPM last, X steps, total

  //Pause function for when RUN_STATE changes (STOPPED, OTHER), timeout thresh in settings...
}

function createRunningFootAnalyzer(settings, listeners){
  //Output: FOOT_STATES
}

function createRunWalkAnalyzer(settings, listeners){
  //Output: RUN_STATES
  //Detect if there is no flight stage? Generation/ loading response thresholds?
}

function createThresholdAnalyzer(settings, listeners){
  //-Basic thresholds
  //threshold enter, stay, exit events
}


//-----Hi Level
//Combine multiple analyzers to do more complex detections
//May need to make inferences with data from multiple analysis
//left right foot
//time between peaks
//impact consistency (current vs average)
//Stride distance?
//etc...

//States (State machine...)
//Run, walk, stopped, other


//Right, left foot
//time between steps
//flight time
//impact consistency (current vs average)
//...

//Run State
//Left 1,2,3,4, Right 1,2,3,4 (interpolate to find preload etc...)

//Tempo, Speed
//Store the average peak to peak time over last X peaks
//Can be used to calculate BPM, interpolate timing between events, sonify if running at desired pace

//Variable Settings
//By analyzing impact forces over last X frames we can adjust analyzer settings & presets
//Also good for predicting next event before it happens

//Micro ML
//Can we create extremely small local models for simple event prediction?
//Can learn in realtime by comparing predictions to actual sensor results

const RUN_STATES = {
  STOPPED: "stopped",
  WALKING: "walking",
  RUNNING: "running", // jog, run, sprint
  DEFAULT: "default" //default or unrecognized state
}

const FOOT_STATES = {
  LEFT_FOOT: "leftFoot",
  RIGHT_FOOT: "rightFoot",
  DEFAULT: "default" //No foot state detected
}

const RUN_GAIT_STATES = {
  //Midstance > Toe Off
  GENERATION: "generation",
  //Toe Off > Max Vertical Displacement
  FLIGHT_UP: "flightUP",
  //Max Vertical Displacement > Max Loading Response
  FLIGHT_DOWN: "flightDown",
  //Max Loading Response > Midstance (transition to other foot)
  LOADING_RESPONSE: "loadingResponse",
  DEFAULT: "default"

}

const WALK_GAIT_STATES = {}

function createInitialRunningAnalyzerData(){
  return {
    runState: RUN_STATES.DEFAULT,
    footState: FOOT_STATES.DEFAULT,
    gaitState: RUN_GAIT_STATES.DEFAULT,
    totalTime: 0,
    runTime: 0,
    totalSteps: 0,
    leftSteps: 0,
    rightSteps: 0,
  }
}

function createRunningAnalyzer(){
  //######Outline########//

  //Necessary Low Level Analyzers
  //--Required for basic functionality--//

  //Optional Low Level Analyzers
  //--For extra modulation or events--//

  //Hybrid State Logic & Analyzers
  //--High level analysis that cannot be performed by a single low level analyzer alone--//
  //runSteps = onPeakEvent && RUN_STATE.RUNNING : increment
  //leftSteps = onPeakEvent && RUN_STATE.RUNNING && FOOT_STATES.LEFT_FOOT

  //High Level Listeners
  //--Triggered by high level state changes--//

  //Low Level Listeners
  //--Triggered by low level state changes--//

  //######End Outline########//



  const runningData = createInitialRunningAnalyzerData();


  const peakAnalyzer = createPeakAnalyzer();


}

//Pass high & low level states down
//Optional analysers
//Activity Analyser (Run, walk, dance, etc...) -> Mapping -> Sound/ Music


//Peak frequency analyzer, other data, time between steps etc...

//---------------------------------Import Export Data-------------------------------------
function exportData(data){
  let a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type:'text/plain'}));
  a.download = "runData" + ".json";
  a.click();
  URL.revokeObjectURL(a);
  //console.log(a.parentNode)
  //document.removeChild(a);
}

function uploadData(onUploaded) {
  const fileList = this.files; /* now you can work with the file list */
  const file = fileList[0]
  //console.log(file)
  //console.log(file.type)

  const reader = new FileReader();

  reader.onload = function(e) {
    if(file.type === 'application/json'){
      //console.log(e.target.result)
      fetch(e.target.result)
        .then((response) => response.json())
        .then((json) => {
          //onUploaded(json);
          //simulator = createSimulator(json);
          onImportData(json)
      });
    }
  }

  reader.readAsDataURL(file);
}