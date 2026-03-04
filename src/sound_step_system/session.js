//---------------------STATES & TYPES----------------------//
const SENSOR_TYPES = {
  ACCELERATION: "acceleration",
  ROTATION: "rotation",
  GYRO: "gyro",
  PRESSURE: "pressure"
}

const LOW_LEVEL_PROCESSOR_TYPES = {
  PEAK: "PEAK",
  ZERO_CROSSING: "ZERO_CROSSING",
  //FOOT_SIDE_DETECTION: "foot_side_detection", High level!
  RANGE: "RANGE",
}

const DATA_TYPES = {
  X: "X",
  Y: "Y",
  Z: "Z",
  PRESSURE_DATA: "PRESSURE_DATA"
}

const HIGH_LEVEL_PROCESSOR_TYPES = {
  BPM_DETECTION: "bpm_detection",
  FOOT_SIDE: "FOOT_SIDE"
}

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

const ACTIVITY_STATES = {
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

//----------------------- SESSION ------------------------//
function createSession(params){
  //Raw data from sensors
  const sessionData = [];
  let currentIndex = 0;
  
  let globalData = null;
  //GLOBAL LATENCY (based on max latency of processor, ex peak proc @ 2 or 3 frames)
  let globalLatency = 0;

  //Low Level Processors : Reads only raw data, does not depend on any other processor
  const lowLevelProcessors = new Map();

  function connectLowLevelProcessor(processor, processorType, sensorType, dataType){
    if(!checkTypeMatch(processorType, sensorType, dataType)) return;
    const name = processorType + sensorType + dataType
    processor.setupProcessor(session, sessionData, sensorType, dataType);
    if(lowLevelProcessors.get(name)) console.warn(`Replacing existing processor with name: ${name}`);
    lowLevelProcessors.set(name, {processor, processorType, sensorType, dataType, name});
    if(processor.maxLatency > globalLatency) globalLatency = maxLatency;
    return name;
  }

  function getLowLevelProcessor(name){
    return lowLevelProcessors.get(name);
  }
  
  function updateLowLevelProcessors(){
    lowLevelProcessors.forEach((pObj, name) => pObj.processor.analyzeRealtime());
  }

  function checkTypeMatch(processorType, sensorType, dataType){
    if(!Object.values(LOW_LEVEL_PROCESSOR_TYPES).includes(processorType)){
      console.warn(`${processorType} : does not exist in LOW_LEVEL_PROCESSOR_TYPES`);
      return;
    }
    if(!Object.values(SENSOR_TYPES).includes(sensorType)){
      console.warn(`${sensorType} : does not exist in SENSOR_TYPES`)
    }
    if(!Object.values(DATA_TYPES).includes(dataType)){
      console.warn(`${dataType} : does not exist in DATA_TYPES`);
      return;
    }
    return true;
  }


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
      index: currentIndex,
      
      acceleration: {x:deviceSensorHandler.accelertationX, y:deviceSensorHandler.accelerationY, z:deviceSensorHandler.accelerationZ},
      gyro:{x:deviceSensorHandler.rotationRateX, y:deviceSensorHandler.rotationRateY, z:deviceSensorHandler.rotationRateZ},
      moveEventInterval: deviceSensorHandler.moveEventInterval,
      rotation: {x:deviceSensorHandler.rotationX, y:deviceSensorHandler.rotationY, z:deviceSensorHandler.rotationZ},
      

      //Mock Data
      //acceleration: {X:mockX(), Y:mockY(), Z:mockZ()},
      //rotation: {X:random(-10, 10), Y:random(-10, 10), X:random(-10, 10)},
    }

    //Store Raw Data
    sessionData.push(data);
    
    //Low Level Processors
    updateLowLevelProcessors();

    //High Level Processors
    //...

    currentIndex++;
  }

  function simulateRecordData(simData){
    sessionData.push(simData);
    updateLowLevelProcessors();
    currentIndex++;
  }
  
  const session = {
    //Rename session to data, have to keep for now to make JSON work...
    set globalData(val){globalData = val},
    get sessionData(){return {global: globalData, session: [...sessionData]} },
    get recordData(){return recordData},
    get simulateRecordData(){return simulateRecordData},
    get connectLowLevelProcessor(){return connectLowLevelProcessor},
    //get clearRealtimeProcessors(){return () => axialSensorProcessors.length = 0} //NEEDS TO BE REDONE...
    get currentIndex(){return currentIndex},
    get globalLatency(){return globalLatency},
  }

  return session;
}


//Helpers for creating mock data for tests
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