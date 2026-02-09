/*-----------------------LOW LEVEL PROCESSORS------------------------*/

//BASE PROCESSOR//
function createLowLevelProcessor(){
    //Parent Session
    let parentSession;
    let parentSessionData;
    let sensorType;
    let dataType;
    let processorType; //To be seen if necessary...
    
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
      get currentIndex(){return currentIndex},
      get currentValue(){return currentValue},
      //Does child need sensor or data types?
  
      //Child Implements
      set analyzeRealtimeChild(value){analyzeRealtimeChild = value},
      set resetProcessor(value){resetProcessor = value},
  
      //Outermost Handle
      get handle(){return {
        get analyzeRealtime(){return analyzeRealtime},
        //get analyzeOffline(){return analyzeOffline},
        get processorData(){return processorData},
        get resetProcessor(){return resetProcessor},
        get setupProcessor(){return setupProcessor},
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
function createLowLevelChildPEAK(peakAnalyzerSettings, listeners){
    const base = createLowLevelProcessor();

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
function createLowLevelChildZXING(zeroCrossSettings, listeners){
    const base = createLowLevelProcessor();

    ///////////////////VARS///////////////////////
    //Events
    zeroCrossingListeners = listeners;

    //Settings
    const resetThreshold = zeroCrossSettings.resetThreshold;

    //Internal Buffers
    let zeroCrossingCandidateIndex = -1;
    let resetMet = false;
    const data = [];

    ////////////////CHILD FUNCS/////////////////////
    function analyze(index){
      
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
        //Good to have but skipping for now.... //let trending = Math.sign(data[index]-data[index-1]);
      }
    
      function confirmZeroCrossing(){
        resetMet = false;
        //console.log(base.parentSessionData[base.parentSession.currentIndex][base.sensorType][base.dataType]);
        //console.log(base.parentSession.currentIndex);
        //console.log(zeroCrossingCandidateIndex)
        base.processorData.set(zeroCrossingCandidateIndex, base.parentSessionData[zeroCrossingCandidateIndex][base.sensorType][base.dataType]);
        const zeroCrossObj = {index: zeroCrossingCandidateIndex, value: base.processorData.get(zeroCrossingCandidateIndex), parentSession: base.parentSession};
        zeroCrossingListeners?.forEach((listener) => {listener(zeroCrossObj)});
        zeroCrossingCandidateIndex = -1;
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
        //console.log(value);
        //console.log(index)
        analyze(index);
    }

    return base.handle;
}



/*----------------------HIGH LEVEL PROCESSORS-----------------------*/