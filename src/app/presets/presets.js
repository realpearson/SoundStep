MobileAppProcessors = [];

function createC1SimulatorSession(){
    //Setup Sounds
    
    const soundAddress = "assets/audio_files/Study/C1/Study heavy ";
    let addresses = [];
    for(let i = 0; i < 13; i++) addresses.push(soundAddress + (i +1) + ".wav");
    const foots = createRandomizer(addresses);
    
    //Listeners
    const stepListeners = {
        onLoPeakEvents: [
            () => foots.playRandom(0, random(1, 1.1), random(0.1)),
          
        ]
    }

    const zXListeners = [

    ]
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, stepListeners);
    //const peakYProcessor = createPeakAnalyzer(defaultPeakSettings, null);
    //const peakZProcessor = createPeakAnalyzer(defaultPeakSettings, null);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, zXListeners);
    

    //Processor Array
    const testProcessorArr = [
        {
            processor: peakXProcessor, 
            processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, 
            sensorType: SENSOR_TYPES.ACCELERATION,  
            dataType: DATA_TYPES.X
        },
        ////{processor: rawYProcessor, processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, sensorType: SENSOR_TYPES.ACCELERATION, dataType: DATA_TYPES.Y},
        //{processor: rawRotZProcessor, processorType: "?", sensorType: SENSOR_TYPES.ROTATION, dataType: DATA_TYPES.Z},
        //{processor: peakYProcessor, processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, sensorType: SENSOR_TYPES.ACCELERATION, dataType: DATA_TYPES.Y},
        //{processor: peakZProcessor, processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, sensorType: SENSOR_TYPES.ACCELERATION, dataType: DATA_TYPES.Z},
        {
            processor: zeroXingProcessor, 
            processorType: LOW_LEVEL_PROCESSOR_TYPES.ZERO_CROSSING, 
            sensorType: SENSOR_TYPES.ACCELERATION, 
            dataType: DATA_TYPES.X
        }
    ]


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){

    }

    function onDeactivate(){
    
    }

    //Simulator Rendering
    function render(rawData){
        renderRawData(rawData, [SENSOR_TYPES.ACCELERATION, DATA_TYPES.X], 0.5, 60, "Vertical Accel");
        renderEventTrigger(rawData, peakXProcessor, 0.5, 60);
        
        renderRawData(rawData, [SENSOR_TYPES.ACCELERATION, DATA_TYPES.X], 0.5, 60 + laneSpacing, "Vertical Accel");
        renderEventTrigger(rawData, zeroXingProcessor, 0.5, 60 + laneSpacing);
                
        //renderRawData(rawData, [SENSOR_TYPES.ACCELERATION, DATA_TYPES.Y], 0.5, 60 + laneSpacing * 2, "Y");
        //renderRawData(rawData, [SENSOR_TYPES.ACCELERATION, DATA_TYPES.Z], 0.5, 60 + laneSpacing * 3, "Z");
        
        renderRawData(rawData, [SENSOR_TYPES.ROTATION, DATA_TYPES.X], 500, 60 + laneSpacing * 4, "X ROT");
        renderRawData(rawData, [SENSOR_TYPES.ROTATION, DATA_TYPES.Y], 100, 60 + laneSpacing * 5, "Y ROT");
        renderRawData(rawData, [SENSOR_TYPES.ROTATION, DATA_TYPES.Z], 100, 60 + laneSpacing * 6, "Z ROT", 485);

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return testProcessorArr},
        get render(){return render}
    }
}

const C1SimulatorPreset = createC1SimulatorSession();

MobileAppProcessors.push({
    simulatorSession: C1SimulatorPreset, 
    processorArray: C1SimulatorPreset.processors, 
    name: "C1 Heavy"
});




function createC2SimulatorSession(){
    //Setup Sounds
    
    const soundAddress = "assets/audio_files/Study/C2/Study light ";
    let addresses = [];
    for(let i = 0; i < 13; i++) addresses.push(soundAddress + (i +1) + ".wav");
    const foots = createRandomizer(addresses);
    
    //Listeners
    const stepListeners = {
        onLoPeakEvents: [
            () => foots.playRandom(0, random(1, 1.1), random(0.1)),
          
        ]
    }

    const zXListeners = [

    ]
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, stepListeners);
    //const peakYProcessor = createPeakAnalyzer(defaultPeakSettings, null);
    //const peakZProcessor = createPeakAnalyzer(defaultPeakSettings, null);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, zXListeners);
    

    //Processor Array
    const testProcessorArr = [
        {
            processor: peakXProcessor, 
            processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, 
            sensorType: SENSOR_TYPES.ACCELERATION,  
            dataType: DATA_TYPES.X
        },
        ////{processor: rawYProcessor, processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, sensorType: SENSOR_TYPES.ACCELERATION, dataType: DATA_TYPES.Y},
        //{processor: rawRotZProcessor, processorType: "?", sensorType: SENSOR_TYPES.ROTATION, dataType: DATA_TYPES.Z},
        //{processor: peakYProcessor, processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, sensorType: SENSOR_TYPES.ACCELERATION, dataType: DATA_TYPES.Y},
        //{processor: peakZProcessor, processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, sensorType: SENSOR_TYPES.ACCELERATION, dataType: DATA_TYPES.Z},
        {
            processor: zeroXingProcessor, 
            processorType: LOW_LEVEL_PROCESSOR_TYPES.ZERO_CROSSING, 
            sensorType: SENSOR_TYPES.ACCELERATION, 
            dataType: DATA_TYPES.X
        }
    ]


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){

    }

    function onDeactivate(){
    
    }

    //Simulator Rendering
    function render(rawData){
        renderRawData(rawData, [SENSOR_TYPES.ACCELERATION, DATA_TYPES.X], 0.5, 60, "Vertical Accel");
        renderEventTrigger(rawData, peakXProcessor, 0.5, 60);
        
        renderRawData(rawData, [SENSOR_TYPES.ACCELERATION, DATA_TYPES.X], 0.5, 60 + laneSpacing, "Vertical Accel");
        renderEventTrigger(rawData, zeroXingProcessor, 0.5, 60 + laneSpacing);
                
        //renderRawData(rawData, [SENSOR_TYPES.ACCELERATION, DATA_TYPES.Y], 0.5, 60 + laneSpacing * 2, "Y");
        //renderRawData(rawData, [SENSOR_TYPES.ACCELERATION, DATA_TYPES.Z], 0.5, 60 + laneSpacing * 3, "Z");
        
        renderRawData(rawData, [SENSOR_TYPES.ROTATION, DATA_TYPES.X], 500, 60 + laneSpacing * 4, "X ROT");
        renderRawData(rawData, [SENSOR_TYPES.ROTATION, DATA_TYPES.Y], 100, 60 + laneSpacing * 5, "Y ROT");
        renderRawData(rawData, [SENSOR_TYPES.ROTATION, DATA_TYPES.Z], 100, 60 + laneSpacing * 6, "Z ROT", 485);

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return testProcessorArr},
        get render(){return render}
    }
}

const C2SimulatorPreset = createC2SimulatorSession();

MobileAppProcessors.push({
    simulatorSession: C2SimulatorPreset, 
    processorArray: C2SimulatorPreset.processors, 
    name: "C2 Light"
});