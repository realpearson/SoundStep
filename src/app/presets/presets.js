
function random(min, max){
    return (Math.random() * (max-min)) + min;
}

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

function createRunMusicSimulatorSession(){
    //Setup Sounds

    //Synth
     //Setup Sounds
    let defaultPatch = {
        name: "",
        voiceGain: 0.3,
        oscWave: "sine",
        oscPitch: 400,
        //get oscPitch(){return (Math.random(-1, 1)*60-30) + 200},
        ampDecay: 2.5,//4.8,
        lfoRate: 0,
        lfoDepth: 2000,//4000,
        lfoWave: "sine",
        infiniteSustain: false,
    };


    const synth1 = createES1();
    synth1.patch1 = defaultPatch;


    const kick = {
        name:"HardKick",
        voiceGain:0.75,
        oscWave:"triangle",
        oscPitch:323.6378752092112,
        ampDecay:0.8999999999999999,
        lfoRate:2.671967427856469,
        lfoDepth:200,
        lfoWave:"envelope",
        infiniteSustain:false
    }

    const kickSynth = createES1();
    kickSynth.patch1 = kick;



    //Samples

    //Bass
    const bassPath = "assets/audio_files/Study/C3/Bass/Bass ";
    let bassAddresses = [];
    for(let i = 0; i < 3; i++) bassAddresses.push(bassPath + (i +1) + ".wav");
    const bass = createRandomizer(bassAddresses);

    //Stab
    const stabPath = "assets/audio_files/Study/C3/Stab/Stab ";
    let stabAddresses = [];
    for(let i = 0; i < 4; i++) stabAddresses.push(stabPath + (i +1) + ".wav");
    const stab = createRandomizer(stabAddresses);

    //Perc
    const percPath = "assets/audio_files/CollabMusic/perc/Collaborative perc ";
    let percAddresses = [];
    for(let i = 69; i < 69 + 45; i++) percAddresses.push(percPath + (i +1) + ".wav");
    const percs = createRandomizer(percAddresses);

    //Drum
    const drumPath = "assets/audio_files/Study/C3/Drum/Drum ";
    let drumAddresses = [];
    for(let i = 0; i < 2; i++) drumAddresses.push(drumPath + (i +1) + ".wav");
    const drums = createRandomizer(drumAddresses);


    function alternatePair(counter, baseIndex){
    return baseIndex + (counter % 2);
    }


    //Triggers

    let counter = 0;
    let bar = 1;

    function barCounter() {
        return function(){
            counter++
            if(counter > 16 ) counter = 1, bar++;
            if(bar > 4 ) bar = 1;
            

        }
    }

    function bassTrigger(){
        

        return function(){
    
            if(counter == 1 && bar == 1 ){bass.playSpecific(0);
                
            }
            if(counter == 1 && bar == 2){bass.playSpecific(1);
            }
            if(counter == 1 && bar == 3){bass.playSpecific(2);
            }
            if(counter == 1 && bar == 4){bass.playSpecific(2);
               
            }
        
            
        }
    }

    function stabTrigger(){
        
        
        return function(){

            if (bar == 1) {
            if(counter == 1){stab.playSpecific(0);
            }
            if(counter == 3){stab.playSpecific(0);
            }

            if(counter == 6){stab.playSpecific(0);
            }
            if(counter == 8){stab.playSpecific(0);
            }
            }

            if (bar == 2) {
            if(counter == 1){stab.playSpecific(1);
            }
            if(counter == 3){stab.playSpecific(1);
            }

            if(counter == 6){stab.playSpecific(1);
            }
            if(counter == 8){stab.playSpecific(1);
            }}

            if (bar == 3) {
            if(counter == 1){stab.playSpecific(2);
            }
            if(counter == 3){stab.playSpecific(2);
            }
        
            if(counter == 6){stab.playSpecific(2);
            }
            if(counter == 8){stab.playSpecific(2);
            }}

            if (bar == 4) {
            if(counter == 1){stab.playSpecific(3);
            }
            if(counter == 3){stab.playSpecific(3);
            }
        
            if(counter == 6){stab.playSpecific(3);
            }
            if(counter == 8){stab.playSpecific(3);
            }}
      

        }
    }

     function drumTrigger(){


        return function(){
   
            console.log("Mono snare test 11:56")
            if(counter == 1){drums.playSpecific(0);}
            if(counter == 3){drums.playSpecific(1);}
            if(counter == 6){drums.playSpecific(0);}
            if(counter == 7){drums.playSpecific(1);}
            if(counter == 11){drums.playSpecific(1);}
            if(counter == 12){drums.playSpecific(0);}
            if(counter == 14){drums.playSpecific(0);}
            if(counter == 15){drums.playSpecific(1);}


      

            ;
               
        }
    }
    

    //Listeners
    const peakListeners = {
        onHiPeakEvents: [barCounter(),() => percs.playRandom(), drumTrigger(), bassTrigger(), stabTrigger()], //() bassTrigger()
        onLoPeakEvents: [barCounter(), () => percs.playRandom(), drumTrigger(), bassTrigger(), stabTrigger()] //[() => bass.playSequence()]bassTrigger()
    }

    //
    
    const nullListeners = [

    ]
    //
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, peakListeners);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, nullListeners);

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
        bass.setAmp(0.6);
        stab.setAmp(0.6);
      
        percs.setAmp(0.1)
 
    }

    function onDeactivate(){
        synth1.stop();

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

