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
    //Sub
    let subA = new soundContainer("assets/audio_files/OskarMusic/Sub A.wav", audioCtx);
    let subD = new soundContainer("assets/audio_files/OskarMusic/Sub A.wav", audioCtx);

    //Pluck
    const pluckPath = "assets/audio_files/CollabMusic/pluck/Collaborative pluck ";
    let pluckAddresses = [];
    for(let i = 0; i < 5; i++) pluckAddresses.push(pluckPath + (i +1) + ".wav");
    const plucks = createRandomizer(pluckAddresses);

    //Bleep/Pluck
    const bleepPath = "assets/audio_files/CollabMusic/bleep/Collaborative bleep ";
    let bleepAddresses = [];
    for(let i = 0; i < 12; i++) bleepAddresses.push(bleepPath + (i +1) + ".wav");
    const bleeps = createRandomizer(bleepAddresses);

   
    //Chord
    const chordPath = "assets/audio_files/CollabMusic/chord/Collaborative chord ";
    let chordAddresses = [];
    for(let i = 0; i < 10; i++) chordAddresses.push(chordPath + (i +1) + ".wav");
    const chords = createRandomizer(chordAddresses);

    //Bass
    const bassPath = "assets/audio_files/CollabMusic/bass/Collaborative bass ";
    let bassAddresses = [];
    for(let i = 0; i < 8; i++) bassAddresses.push(bassPath + (i +1) + ".wav");
    const bass = createRandomizer(bassAddresses);

    //Pad
    const padPath = "assets/audio_files/CollabMusic/pad/Collaborative pad ";
    let padAddresses = [];
    for(let i = 0; i < 4; i++) padAddresses.push(padPath + (i +1) + ".wav");
    const pads = createRandomizer(padAddresses);

    //Perc
    const percPath = "assets/audio_files/CollabMusic/perc/Collaborative perc ";
    let percAddresses = [];
    for(let i = 69; i < 69 + 45; i++) percAddresses.push(percPath + (i +1) + ".wav");
    const percs = createRandomizer(percAddresses);

    //Drum
    const drumPath = "assets/audio_files/CollabMusic/drum/Collaborative drum ";
    let drumAddresses = [];
    for(let i = 0; i < 3; i++) drumAddresses.push(drumPath + (i +1) + ".wav");
    const drums = createRandomizer(drumAddresses);


    function alternatePair(counter, baseIndex){
    return baseIndex + (counter % 2);
    }


    //Triggers

    //Synth
    function createKickTrigger(){
        let counter = 1;

        return function(){
            if(counter > 4 ) counter = 1;
            //if(counter % 2 === 0) synth1.playVoice1(audioContext.currentTime + audioContext.baseLatency);
            //if(counter % 2 === 0) synth1.applyDynamicPatchChange({oscPitch: Math.random() * 400 + 100});
            kickSynth.playVoice1(audioContext.currentTime);

            counter++;
        }
    }

    let kickTrig = createKickTrigger();

    function createNoteGen(){
        let counter = 1;

        const freks = [295, 329.6, 370, 393];
        

        return function(){
            if(counter > 4 ) counter = 1;
            if(counter % 2 === 0) {
                let note = freks[Math.floor(Math.random() * freks.length)];
                if(Math.random() < 0.6) note /= 2;
                let rate = note * 1.9;
                console.log(note, rate);
                synth1.playVoice1(audioContext.currentTime);
                synth1.applyDynamicPatchChange({oscPitch: note, lfoRate: rate});
                //const wave = Object.values(ES1_LFO_TYPES)[Math.floor(Math.random()*Object.values(ES1_LFO_TYPES).length)];
                //synth1.applyDynamicPatchChange({lfoWave: wave});
            }

            

            counter++;
        }
    }

    let noteTrig = createNoteGen();

    //Samples
    let counter = 1;
    let counter3 = 1

    function chordTrigger(){
        
        return function(){
            if(counter > 8 ) counter = 1;

            if(counter <= 2){null;
                //console.log(alternatePair(counter,0));
            }
            else if(counter > 2 && counter <= 5){null;
                //console.log(alternatePair(counter,3));
            }
            else if(counter > 5 && counter <= 8){null;
                //console.log(alternatePair(counter,6));
            }
            
            counter++
            counter3++;
        }
    }

    function subTrigger(){

        return function(){
            if(counter > 8 ) counter = 1;
            

            if(counter == 1){subD.play();
            }

            counter++
        
            
        }
    }

    function pluckTrigger(){
        
        
        return function(){
            if(counter3 > 8 ) counter3 = 1;

            if(counter == 2){plucks.playSpecific(0);
            }
            if(counter == 3){plucks.playSpecific(1);
            }
            if(counter == 4){plucks.playSpecific(2);
            }
            if(counter == 6){plucks.playSpecific(3);
            }
            if(counter == 8){plucks.playSpecific(4);
            }
            
            counter3++;    

        }
    }

     function drumTrigger(){
        counter4 = 1;
        let pCounter = 1;

        return function(){
            if(counter4 > 16 ) counter4 = 1, pCounter++;
        
            
 
            //console.log("phrase 2");
            if(counter4 == 1){drums.playSpecific(0);}
            if(counter4 == 3){drums.playSpecific(2);}
            if(counter4 == 6){drums.playSpecific(0);}
            if(counter4 == 7){drums.playSpecific(2);}
            if(counter4 == 11){drums.playSpecific(2);}
            if(counter4 == 12){drums.playSpecific(0);}
            if(counter4 == 14){drums.playSpecific(0);}
            if(counter4 == 15){drums.playSpecific(2);}


      

            counter4++;
               
        }
    }
    

    //Listeners
    const peakListeners = {
        onHiPeakEvents: [() => percs.playRandom(), drumTrigger()], //() 
        onLoPeakEvents: [() => percs.playRandom(), drumTrigger(), subTrigger()] //[() => bass.playSequence()]
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
        bass.setAmp(0.4);
        bleeps.setAmp(0.1)
        pads.setAmp(0.5)
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

const runMusicSimulatorPreset = createRunMusicSimulatorSession();

MobileAppProcessors.push({
    simulatorSession: runMusicSimulatorPreset, 
    processorArray: runMusicSimulatorPreset.processors, 
    name: "Run Music"
});

