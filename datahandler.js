//Store all raw data -> divide into processing buffers -> process data
//SessionData=(globals/everything) -> processing buffers
//Press record-> Create session, create global data, create raw data, map to processing buffers

const SENSOR_TYPES = {
  ACCELERATION: "acceleration",
  ROTATION: "rotation", //Gyro?
  PRESSURE: "pressure"
}

const LOW_LEVEL_PROCESSOR_TYPES = {
  PEAK: "PEAK",
  ZERO_CROSSING: "ZERO_CROSSING",
  //FOOT_SIDE_DETECTION: "foot_side_detection", High level!
  RANGE: "RANGE",

}


const ACCELERATION_PROCESSOR_TYPES = {
  PEAK: "PEAK",
  ZERO_CROSSING: "ZERO_CROSSING"
}

const DATA_TYPES = {
  X: "X",
  Y: "Y",
  Z: "Z",
  PRESSURE_DATA: "PRESSURE_DATA"
}

/**
 * Situation
 * 
 * peak detected at index 5
 * 
 * we want foot side state at index 5
 * 
 * footSideData = currentSession.querryIndex(index, PROC_TYPES.FOOT_SIDE);
 * console.log(footSideData.footState)
 * 
 * get time between right foot steps =
 * currenSession.querryIndex(footSideData.indexOfRightFootDown(0)).timestamp - currenSession.querryIndex(footSideData.indexOfRightFootDown(-1)).timestamp
 * 
 * Getting raw data from currentSession by index: sensor data, timestamps
 * 
 * Getting processed data from currentSession, get processor ref, access data by index
 *
 */

const HIGH_LEVEL_PROCESSOR_TYPES = {
  BPM_DETECTION: "bpm_detection",
  FOOT_SIDE: "FOOT_SIDE"
}

//Helper for data filtering
function getNestedKeys(obj, keys){
  let val = obj[keys[0]];
  for(let i = 1; i < keys.length; i++) val = val[keys[i]];
  return val;
}

function createSession(params){
  
  let globalData = null;
  //GLOBAL LATENCY (based on max latency of processor, ex peak proc @ 2 or 3 frames)
  
  //lowLevelProcessors only accept raw sensor data.
  const accelerationProcessors = {
    [ACCELERATION_PROCESSOR_TYPES.PEAK]: {
      [DATA_TYPES.X]: null,
      [DATA_TYPES.Y]: null,
      [DATA_TYPES.Z]: null,
    },
    [ACCELERATION_PROCESSOR_TYPES.ZERO_CROSSING] : {
      [DATA_TYPES.X]: null,
      [DATA_TYPES.Y]: null,
      [DATA_TYPES.Z]: null,
    }
  }

  /////////
  const lowLevelProcessors = new Map();

  function connectLowLevelProcessor(processor, processorType, sensorType, dataType, name){
    //Helper function to check for valid: processorType, sensorType, dataType
    lowLevelProcessors.set(name, {processor, processorType, sensorType, dataType, name});
    //Check it name not valid & give error
  }

  function getLowLevelProcessor(name){
    return lowLevelProcessors.get(name);
  }

  ////////

  function checkAccelProcType(type, axis){
    if(!Object.keys(ACCELERATION_PROCESSOR_TYPES).includes(type)){
      console.warn("No processor of type: " + type);
      return;
    }
    if(!Object.keys(DATA_TYPES).includes(axis)){
      console.warn(axis + " is not a valid axis");
      return;
    }
    return true;
  }

  function connectAccelerationProcessor(processor, type, axis){
    if(! checkAccelProcType(type, axis)) return;
    accelerationProcessors[type][axis] = processor;
    const dataFilter = ["acceleration", axis];
    //parent, sessionData, processorSensorType, processorDataType
    processor.setupProcessor(session, sessionData, SENSOR_TYPES.ACCELERATION, axis);
    //processor.setupProcessor(session, dataFilter, sessionData);
  }

  function getAccelerationProcessor(type, axis){
    if(! checkAccelProcType(type, axis)) return;
    return accelerationProcessors.get(type).get(axis);
  }

  function updateAccelerationProcessors(){
    Object.keys(accelerationProcessors).forEach((type) => {
      Object.keys(accelerationProcessors[type]).forEach((axis) => {
        if(accelerationProcessors[type][axis]) {
          //console.log(accelerationProcessors[type][axis])
          accelerationProcessors[type][axis].analyzeRealtime();
        }
      })
    });
  }

  /* CHANGE TO ABOVE
  const rotationProcessors = new Map();

  function connectRotationProcessor(){}
  function getRotationProcessor(){}
  function updateRotationProcessors(){}
  */


  //sessionData only stores raw sensor data
  const sessionData = [];
  //currentIndex is the 'master clock' and allows algorithms to cross correlate
  //between data arrays. Some algorithms have latency and need to reference
  //previous data indexes. Event callbacks use indexes to reference relevant data
  //rather than receiving data.
  let currentIndex = 0;


  function createMockSinData(){
    let theta = ((Math.random()-0.5) * 2) * Math.PI;
    return function(){
      theta += 0.4;
      return Math.sin(theta) * 40;
    }
  }

  const mockX = createMockSinData();
  const mockY = createMockSinData();
  const mockZ = createMockSinData();

  function recordData(){

    const timestamp = performance.now();
    
    if(globalData === null) {
      globalData = {
        sessionName: params?.name||'',
        //Experiment data, participant id, condition, etc...
        date: Date.now(), 
        //t0: timestamp, 
        audioOutputLatency: audioCtx.outputLatency, 
      }
    }

    const data = {
      //Header Data
      timestamp,
      index: currentIndex, //Makes it quick to cross corralate between data sets
      //GET SENSOR DATA W/O P5 VARS!

      //Sensor Types & Data
      /*
      acceleration: {x:accelerationX, y:accelerationY, z:accelerationZ},
      rotation: {x:rotationX, y:rotationY, z:rotationZ},
      pressure: {pressureValue: 0},
      */

      //Mock Data
      acceleration: {X:mockX(), Y:mockY(), Z:mockZ()},
      rotation: {X:random(-10, 10), Y:random(-10, 10), X:random(-10, 10)},
      //Pressure data
      //metaData: {}
    }

    //Store Raw Data
    sessionData.push(data);
    //Low Level Processors
    updateAccelerationProcessors();

    //High Level Processors
    //These processors have access to raw & processed data

    currentIndex++;
  }



  function simulateRecordData(simData){
    sessionData.push(simData);
    updateAccelerationProcessors();
    currentIndex++;
  }
  
  
  const session = {
    //Rename session to data, have to keep for now to make JSON work...
    set globalData(val){globalData = val},
    get sessionData(){return {global: globalData, session: [...sessionData]} },
    get recordData(){return recordData},
    get simulateRecordData(){return simulateRecordData},
    get connectAccelerationProcessor(){return connectAccelerationProcessor},
    //get clearRealtimeProcessors(){return () => axialSensorProcessors.length = 0} //NEEDS TO BE REDONE...
    get currentIndex(){return currentIndex},
  }

  return session;
}



//---------------------------------Data Processing & Analyzers-------------------------------------

const defaultPeakSettings = {
  framesUntilPeakConfirm: 2,
  frameCooldownThresh: 10,
  hiMode: {peakThresh: 5, resetThresh: 1},
  loMode: {peakThresh: -5, resetThresh: -1},
  //Predictive Settings
  //usePrediction: false,
  //predictionThresh...
}




function createPeakAnalyzer(peakAnalyzerSettings, listeners){
  //Parent Session
  let parentSession;
  let dataFilter;
  let debug = false;
  let parentSessionData;
  //Parent Buffers
  let index;
  let val;

  function setupProcessor(parent, keys, sessionData){
    parentSession = parent;
    parentSessionData = sessionData;
    dataFilter = keys;
  }

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

  //Internal Buffers
  let prevPeakDir = 0;
  let maxVal = 0;
  let minVal = 0;
  let peakCandidateIndex = -1;
  let framesSincePeakCandidate = 0;
  let framesSincePrevPeak = 0;
  


  //Data
  let interpolatedVal; //Not implemented...
  const peakData = new Map(); //peaks.set(index, peakData), last peak is latest entry
  //Total peaks (steps) = peakData.size


  function checkForHiPeak(){
    if(!hiMode) return;
    if(val < hiPeakThresh || val <= maxVal || prevPeakDir > 0) return;
    //Catch rapid polarity shifts
    if(peakCandidateIndex >= 0 && peakData.get(peakCandidateIndex) < 0) confirmPeak();//if(peakCandidateIndex >= 0 && data[peakCandidateIndex] < 0) confirmPeak();
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
    if(peakCandidateIndex >= 0 && peakData.get(peakCandidateIndex) > 0) confirmPeak();//if(peakCandidateIndex >= 0 && data[peakCandidateIndex] > 0) confirmPeak();
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
      
    //INTERNAL DATA
    let peakValue = getNestedKeys(parentSessionData[peakCandidateIndex], dataFilter);
    peakData.set(peakCandidateIndex, peakValue);
    const peakObj = {index: peakCandidateIndex, val: peakValue, parentSession};
    
    //FIRE EVENTS
    const polarity = Math.sign(peakValue);
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
    else if(loMode && prevPeakDir < 0 && val > loResetThresh) resetBuffer();
  }
  
  function checkPeakConfirm(){
    if(peakCandidateIndex >= 0){
      if(framesSincePeakCandidate >= framesUntilPeakConfirm) confirmPeak();
      framesSincePeakCandidate++;
    }
  }

  function resetProcessor(){
    resetBuffer();
    peakCandidateIndex = -1;
    framesSincePeakCandidate = 0;
    framesSincePrevPeak = 0;
    peakData.length = 0; //clear? this is map now...
    index = 0;
  }

  function analyzeRealtime(){
    index = parentSession.currentIndex;
    val = getNestedKeys(parentSessionData[parentSession.currentIndex], dataFilter);

    const sensorType = SENSOR_TYPES.ACCELERATION;
    const axis = DATA_TYPES.X;
    const processorType = LOW_LEVEL_PROCESSOR_TYPES.PEAK_DETECTION;

    //Processor needs sensorType & axis as key to data
    //Externally we need processorType & axis to access a specific processor
    //Map again for easy access by name?
    const pobj = {processor: null, sensorType, axis, processorType, name:"default"}

    incrementFramesPrevPeak();
    checkForHiPeak();
    checkForLoPeak();
    calcCooldowns();
    checkPeakConfirm();
  }

  /*
  function analyzeOffline(data){
    for(let i = 0; i < data.length; i++){
      analyzeRealtime(data[i]);
    }
  }
  */
  
  return {
    get analyzeRealtime(){return analyzeRealtime},
    //get analyzeOffline(){return analyzeOffline},
    get data(){return peakData},
    get resetProcessor(){return resetProcessor},
    get setupProcessor(){return setupProcessor},
  }
}




const defaultZeroCrossingSettings = {
  resetThreshold: 4,
  zeroCrossingThreshold: 0.1
}

function createZeroCrossingAnalyzer(zeroCrossSettings, listeners){
  const resetThreshold = zeroCrossSettings.resetThreshold;
  
  //Parent Session
  let parentSession;
  let dataFilter;
  let parentSessionData;

  //Incremented Parent Buffer
  let index;

  function setupProcessor(parent, keys, sessionData){
    parentSession = parent;
    parentSessionData = sessionData;
    dataFilter = keys;
  }

  //Data
  const data = [];
  //const zeroCrossingData = [];
  const zeroCrossingData = new Map();
  //zerCrossingDataMap.set(0, {eventType: "ZeroCrossing", value: 3})



  //Internal Buffers
  let zeroCrossingCandidateIndex = -1;
  let resetMet = false;
  //let trending = 0;

  function analyze(){
    
    if(data.length < 2) return;
    if(!resetMet && Math.abs(data[data.length-1]) < resetThreshold) return;
    else resetMet = true;
    
    //Zero crossing between frames
    if(resetMet && (Math.sign(data[1]) != Math.sign(data[0]))){
      if(Math.abs(data[1]) < Math.abs(data[0])) zeroCrossingCandidateIndex = index;
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
    //zeroCrossingData[zeroCrossingCandidateIndex].isZeroCrossing = true;
    
    
    //What do we want to pass down to the event...
    //-index
    //-value
    //-ref to session
    const valIndex = zeroCrossingCandidateIndex < index ? 0 : 1;
    zeroCrossingData.set(zeroCrossingCandidateIndex, data[valIndex]);
    //console.log(zeroCrossingData.get(zeroCrossingCandidateIndex));
    const zeroCrossObj = {index: zeroCrossingCandidateIndex, val: data[valIndex], parentSession};
    listeners?.forEach((listener) => {listener(zeroCrossObj)});

    zeroCrossingCandidateIndex = -1;
  }

  function resetProcessor(){
    index = 0;  
    data.length = 0;
    zeroCrossingData.length = 0;;
    zeroCrossingCandidateIndex = -1;
    resetMet = false;
  }

  function analyzeRealtime(/*dataPoint*/){
    
    index = parentSession.currentIndex;
    val = getNestedKeys(parentSessionData[parentSession.currentIndex], dataFilter);
    //Just keep the last 2 values, should keep rest of algorithm working without refactoring
    //while not eating up too much memory with a giant buffer array...
    if(data.length > 1) data.splice(0, 1);
    data.push(val);

    //...?
    //data.push(dataPoint);
    //zeroCrossingData.push({value: dataPoint});
    //index = data.length-1;
    //val = dataPoint;


    analyze();
  }

  function analyzeOffline(){
    for(let i = 0; i < data.length; i++){
      analyzeRealtime(data[i]);
    }
  }

  return {
    get analyzeRealtime(){return analyzeRealtime},
    get analyzeOffline(){return analyzeOffline},
    get data(){return zeroCrossingData},
    get setupProcessor(){return setupProcessor},
    get resetProcessor(){return resetProcessor}
  }
}




function createTempoAnalyzer(settings, listeners){
  //Output:
  //time since last step
  //avg time over last X steps
  //avg time total
  //estimated BPM last, X steps, total
  //running average

  const runningAverageBucket = []
  let runningAverageTime = -1;
  let estimatedBPM = -1;
  let fluctuation = 0; //If fluctuation too high bpm is not reliable, also good if we want to wait until stable value

  //Pause function for when RUN_STATE changes (STOPPED, OTHER), timeout thresh in settings...
}

function createRunningFootAnalyzer(settings, listeners){
  //Output: FOOT_STATES
  
  //This is easy to detect with X ROT data, for each acceleration peak the rotation peak switches polarity
  //All we have to do is look at the previous X ROT peak to know wheather it was a left or right step

  //Total right/ left steps
  //Right/ left events

  //Only turn on when it's time
  let active = false;

  //Parent Session
  let parentSession;
  let dataFilter;
  let parentSessionData;

  //Incremented Parent Buffer
  let index;

  function setupProcessor(parent, keys, sessionData){
    parentSession = parent;
    parentSessionData = sessionData;
    dataFilter = keys;

    //parentSession.getAccelerationProcessor()
    //WE could just add an event listener to X ROT peak detector...
  }

  function analyzeRealtime(){
    index = parentSession.currentIndex;

    //Find previous X ROT Peak 
  }

  return {
    get analyzeRealtime(){return analyzeRealtime},
    get setupProcessor(){return setupProcessor}
  }
}

function createRunWalkAnalyzer(settings, listeners){
  //Output: RUN_STATES
  //Detect if there is no flight stage? Generation/ loading response thresholds?

  //There is a really clear pattern in the X ROT data when walking, graph in the sanbox to see
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


  //Total steps can be grabbed from the length of the acceleration x peak data


  const runningData = createInitialRunningAnalyzerData();


  const peakAnalyzer = createPeakAnalyzer();


}

//Pass high & low level states down
//Optional analysers
//Activity Analyser (Run, walk, dance, etc...) -> Mapping -> Sound/ Music


//Peak frequency analyzer, other data, time between steps etc...




/*
//STATES STATES STATES//

There will be a lot of high level logic to piece together logic

-When do we start counting steps?
-Keeping track of step count while walking, jogging, running etc... also where they right or left steps?
-Callibration (especially for rotation) to find null axis
-Lots of thresholds, peak amplitudes, time between steps, etc... for determining current state (think intervals, warmup, adhering to goals, etc...)

GESTURES
-Gesture system for controlling application with sound/ voice feedback
-Jump 3 times, lean left/ right, lean forward for 2 seconds etc...

//Papers about the interface, application and design itself?




*/


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