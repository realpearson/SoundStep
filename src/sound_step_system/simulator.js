//----------------------Simulator----------------------//
function createSimulator(data){
    const session = createSession();
    //Loaded in via preset
    let processors;
    let render;
    let preset;
  
    //Internal Logic
    let active = false;
    let inc = 0;
    //let timeOffsetAccumulator = 0;
    //let dataFrameLen = 0;//calcDataFR();
    

    const discrepencyThreshold = 20;
    let totalTimeElapsed = 0;
    let dataTimeElapsed = 0;
  
    const simulationBuffer = [];
  
  
function setupProcessors(){
    processors.forEach((p) => {
        session.connectLowLevelProcessor(p.processor, p.processorType, p.sensorType, p.dataType);
    })
      
}
  
function increment(debug){
  if(!active) return;
  if(inc >= data.session.length-1) return;

  //if(inc %10 == 0) console.log(frameRate());
  if(inc > 0 && inc %10 == 0) console.log(`time discrepency: ${data.session[inc].timestamp - data.session[inc-1].timestamp} simulation framerate: ${frameRate()}`);
  
  if(totalTimeElapsed - dataTimeElapsed > discrepencyThreshold){
    //Insert extra frame to compensate
    step(debug);
    step(debug);
  } else if(totalTimeElapsed - dataTimeElapsed < -discrepencyThreshold){
    //Skip frame to compensate
  } else {
    step(debug);
  }
  //Accumulate difference between target frame length and actual
  if(inc > 0) dataTimeElapsed = data.session[inc].timestamp - data.session[0].timestamp;
  totalTimeElapsed += deltaTime;
     
}
  
function step(debug){
  simulationBuffer.push(data.session[inc]);
  session.simulateRecordData(data.session[inc]);
  inc++;
}
  
  
function reset(){
      //Reset Simulator
      totalTimeElapsed = 0;
      dataTimeElapsed = 0;
      inc = 0;
      //Reset Processors
      processors.forEach((p) => p.processor.resetProcessor());
}
    
const simulatorSession = {
      get increment(){return increment},
      //get currentIndex(){return inc},
      get setDataPos(){return (pos) => {inc = pos < data.session.length ? pos : inc}},
      //get dataPos(){return inc},
      get loadPreset(){return function(simPreset){
        processors = simPreset.processors;
        setupProcessors();
        render = simPreset.render;
        preset = simPreset;
      }},
      get play(){return () => {
        active = true;
        preset.onActivate();
      }},
      get stop(){return () => {
        active = false;
        preset.onDeactivate();
      }},
      get render(){return function(){
        if(render && simulationBuffer.length > 0) render(simulationBuffer);
      }},
      get reset(){return reset}
    }
  
    return simulatorSession;
}


//----------------------Rendering----------------------//
//RENDERING NOTES
//-Overlay data on same lane
//-Color code data
//-Render states with color blocks
//-Make data lanes seperate objects
//  >Each have own canvas
//  >Only render part of data on screen
//-New simulator that houses a normal session
//-Offline mode that pre-calculates all data
  
function renderEventTrigger(buffer, processor, scalar, yPos){
    for(let i = 0; i < buffer.length; i++){
        let x = i;
        if(buffer.length >= width) x -= (buffer.length-width);
    
        const dataPt = processor.processorData.get(i);
        if(dataPt !== undefined) circle(x, -dataPt * scalar + yPos, 5);
    }
}
  
function renderRawData(buffer, dataFilter, scalar, yPos, name, offset){
    if(!offset) offset = 0;
    //const buffer = processor.
    strokeWeight(1);
    stroke(0)
    text(name, 80, yPos-45);
    noFill();
    line(0, yPos, width, yPos); //null axis
  
    beginShape();
    if(buffer.length < 1) return;
    for(let i = 0; i < buffer.length; i++){
        let x = i;
        if(buffer.length >= width) x -= (buffer.length-width);
        const dataPt = buffer[i][dataFilter[0]][dataFilter[1]];
        point(x, -dataPt * scalar + yPos + offset);
        //vertex(i, -buffer[i].value * scalar + yPos + offset);
    }
    endShape();
}

function alignmentChecker(){
    line(mouseX, 0, mouseX, height);
}
  



