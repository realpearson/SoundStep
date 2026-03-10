/*-----------------------LOW LEVEL PROCESSORS------------------------*/

//PROCESSOR SETTINGS//
const defaultPeakSettings = {
  framesUntilPeakConfirm: 2,
  frameCooldownThresh: 10,
  hiMode: {peakThresh: 5, resetThresh: 1},
  loMode: {peakThresh: -5, resetThresh: -1},
  //Predictive Settings
  //usePrediction: false,
  //predictionThresh...
}

const defaultZeroCrossingSettings = {
  resetThreshold: 4,
  zeroCrossingThreshold: 0.1
}

//BASE PROCESSOR//
function createLowLevelProcessor(){
    //Parent Session
    let parentSession;
    let parentSessionData;
    let sensorType;
    let dataType;
    let maxLatency = 0;
    let processorType; //To be seen if necessary...

    let callibrationOffset = 0;
    
    //Iterated Buffers
    let currentIndex;
    let currentValue;
  
    function setupProcessor(parent, sessionData, processorSensorType, processorDataType){
      parentSession = parent;
      parentSessionData = sessionData;
      sensorType = processorSensorType;
      dataType = processorDataType;
    }
  
    //Data
    const processorData = new Map();
  
    function analyzeRealtime(){
      currentIndex = parentSession.currentIndex;
      //console.log(currentIndex)
      //console.log(parentSessionData.length)
      currentValue = parentSessionData[currentIndex][sensorType][dataType];
      analyzeRealtimeChild(currentIndex, currentValue);
    }
  
    /*
    function analyzeOffline(data){
      for(let i = 0; i < data.length; i++){
        analyzeRealtime(data[i]);
      }
    }
    */
  

    function analyzeRealtimeChild(index, value){
        //Child Implements
        console.log("not implemented")
      }
    
    function resetProcessor(){
      //Child Implements
    }

    
    return {
      //Child Access
      get parentSession(){return parentSession},
      get parentSessionData(){return parentSessionData},
      get processorData(){return processorData},
      get sensorType(){return sensorType},
      get dataType(){return dataType},
      get callibrationOffset(){return callibrationOffset},
      get currentIndex(){return currentIndex},
      get currentValue(){return currentValue},
      set maxLatency(val){maxLatency = val},
      //Does child need sensor or data types?
  
      //Child Implements
      set analyzeRealtimeChild(value){analyzeRealtimeChild = value},
      set resetProcessor(value){resetProcessor = value},
  
      //Outermost Handle
      get handle(){return {
        get analyzeRealtime(){return analyzeRealtime},
        //get analyzeOffline(){return analyzeOffline},
        set callibrationOffset(val){callibrationOffset = val},
        get processorData(){return processorData},
        get resetProcessor(){return resetProcessor},
        get setupProcessor(){return setupProcessor},
        get maxLatency(){return maxLatency},
      }},
    }
}

//TEMPLATE//
function createLowLevelChild(settings, listeners){
    const base = createLowLevelProcessor();

    ///////////////////VARS///////////////////////
    //Events

    //Peak Detection Settings

    //Internal Buffers

    ////////////////CHILD FUNCS/////////////////////

    ///////////////OVERRIDE FUNCS///////////////////

    base.resetProcessor = function(){
        
    }

    base.analyzeRealtimeChild = function(index, value){

    }

    return base.handle;

}

//Peak Processor//
function createPeakAnalyzer(peakAnalyzerSettings, listeners){
    const base = createLowLevelProcessor();
    base.maxLatency = peakAnalyzerSettings.framesUntilPeakConfirm +1;

    ///////////////////VARS///////////////////////
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

    ////////////////CHILD FUNCS/////////////////////
    function checkForHiPeak(index, value){
        if(!hiMode) return;
        if(value < hiPeakThresh || value <= maxVal || prevPeakDir > 0) return;
        //Catch rapid polarity shifts
        if(peakCandidateIndex >= 0 && base.processorData.get(peakCandidateIndex) < 0) confirmPeak();
        //We have exceded current peak candidate, set new
        if(debug) console.log(`hiC, val: ${value}, index: ${index}, pMax: ${maxVal}`);
        maxVal = value;
        peakCandidateIndex = index;
        framesSincePeakCandidate = 0;
    }
      
    function checkForLoPeak(index, value){
        if(!loMode) return;
        if(value > loPeakThresh || value >= minVal || prevPeakDir < 0) return;
        //Catch rapid polarity shifts
        if(peakCandidateIndex >= 0 && base.processorData.get(peakCandidateIndex) > 0) confirmPeak();
        //We have exceded current peak candidate, set new
        if(debug) console.log(`loC, val: ${value}, index: ${index}, pMin: ${minVal}`);
        minVal = value;
        peakCandidateIndex = index;
        framesSincePeakCandidate = 0;
    }
      
    function resetBuffer(index, value){    
        if(debug) console.log("reset min, max, dir")
        minVal = 0;
        maxVal = 0;
        prevPeakDir = 0;
    }
      
    function confirmPeak(){
          
        //INTERNAL DATA
        let peakValue = base.parentSessionData[peakCandidateIndex][base.sensorType][base.dataType];
        base.processorData.set(peakCandidateIndex, peakValue);
        const peakObj = {index: peakCandidateIndex, value: peakValue, parentSession: base.parentSession};
        
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
      
    function incrementFramesPrevPeak(index, value){
        if(debug) console.log(`val: ${value}, index: ${index}, pDir: ${prevPeakDir}, peakCInd: ${peakCandidateIndex}`);
        framesSincePrevPeak++;
    }
      
    function calcCooldowns(index, value){
        if(hiMode && prevPeakDir < 0) {
          if(value < hiResetThresh) if(peakCandidateIndex >= 0) confirmPeak();
        } else if(loMode && prevPeakDir > 0){
          if(value > loResetThresh) if(peakCandidateIndex >= 0) confirmPeak();
        }
    
        if(hiMode && prevPeakDir > 0 && value < hiResetThresh) resetBuffer();
        else if(loMode && prevPeakDir < 0 && value > loResetThresh) resetBuffer();
    }
      
    function checkPeakConfirm(index, value){
        if(peakCandidateIndex >= 0){
          if(framesSincePeakCandidate >= framesUntilPeakConfirm) confirmPeak();
          framesSincePeakCandidate++;
        }
    }


    ///////////////OVERRIDE FUNCS///////////////////

    base.resetProcessor = function(){
        resetBuffer();
        peakCandidateIndex = -1;
        framesSincePeakCandidate = 0;
        framesSincePrevPeak = 0;
        //peakData.length = 0; //clear? this is map now...
        index = 0;
    }

    base.analyzeRealtimeChild = function(index, value){
        incrementFramesPrevPeak(index, value);
        checkForHiPeak(index, value);
        checkForLoPeak(index, value);
        calcCooldowns(index, value);
        checkPeakConfirm(index, value);
    }

    return base.handle;
}

//Zero Crossing Processor//
function createZeroCrossingAnalyzer(zeroCrossSettings, listeners){
    const base = createLowLevelProcessor();
    base.maxLatency = 1;
    ///////////////////VARS///////////////////////
    //Events
    zeroCrossingListeners = listeners;

    //Settings
    const resetThreshold = zeroCrossSettings.resetThreshold;

    //Internal Buffers
    let zeroCrossingCandidateIndex = -1;
    let resetMet = false;
    let latencyCompensationBuffer = {frames:0, payload: null};
    const data = [];

    ////////////////CHILD FUNCS/////////////////////
    function analyze(index){
      
        if(data.length < 2) return;
        if(!resetMet && Math.abs(data[data.length-1]) < resetThreshold) return;
        else resetMet = true;
        
        //Zero crossing between frames
        if(resetMet && (Math.sign(data[1]) != Math.sign(data[0]))){
          zeroCrossingCandidateIndex = Math.abs(data[1]) < Math.abs(data[0]) ? index : index-1;
          confirmZeroCrossing();
        }
    
        //The rest of this algorithm would really just be the edge case where we reach the threshold
        //but switch directions before the polarity of the value changes.
        //Good to have but skipping for now.... //let trending = Math.sign(data[index]-data[index-1]);
      }
    
      function confirmZeroCrossing(){
        resetMet = false;
        base.processorData.set(zeroCrossingCandidateIndex, base.parentSessionData[zeroCrossingCandidateIndex][base.sensorType][base.dataType]);
        
        const zeroCrossObj = {index: zeroCrossingCandidateIndex, value: base.processorData.get(zeroCrossingCandidateIndex), parentSession: base.parentSession};
        
        //zeroCrossingListeners?.forEach((listener) => {listener(zeroCrossObj)}); 
        //Latency Compensation
        latencyCompensationBuffer.payload = zeroCrossObj;
        latencyCompensationBuffer.frames = Math.abs(data[1]) < Math.abs(data[0]) ? 0 : 1;
        
        zeroCrossingCandidateIndex = -1;
      }


      function checkForLatency(){
        if(latencyCompensationBuffer.payload == null) return;
        if(latencyCompensationBuffer.frames >= base.parentSession.globalLatency){
          zeroCrossingListeners?.forEach((listener) => {listener(zeroCrossObj)});
          latencyCompensationBuffer = {frames:0, payload: null};
          return;
        }
        latencyCompensationBuffer.frames++;
      }

    ///////////////OVERRIDE FUNCS///////////////////

    base.resetProcessor = function(){
        data.length = 0;
        zeroCrossingData.length = 0;;
        zeroCrossingCandidateIndex = -1;
        resetMet = false;
    }

    base.analyzeRealtimeChild = function(index, value){
        if(data.length > 1) data.splice(0, 1);
        data.push(value);
        analyze(index);
        checkForLatency();
    }

    return base.handle;
}



/*----------------------HIGH LEVEL PROCESSORS-----------------------*/







//---------------------------------Data Processing & Analyzers-------------------------------------

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