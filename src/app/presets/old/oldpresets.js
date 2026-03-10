
////////////////////////////////////////////////////////////////////////////////
function createAsphaltSimulatorSession(){
    //Setup Sounds
    
    const soundAddress = "assets/audio_files/Footsteps/Footstep asphalt ";
    let addresses = [];
    for(let i = 0; i < 10; i++) addresses.push(soundAddress + (i +1) + ".wav");
    const foots = createRandomizer(addresses);

    const soundAddressBirds = "assets/audio_files/Ambience/Ambience bird";
    let birdaddresses = [];
    for(let i = 0; i < 10; i++) birdaddresses.push(soundAddressBirds + (i +1) + ".wav");
    const birds = createRandomizer(birdaddresses);
    birds.setAmp(0.3);
    let birdTimeoutID;

    const wind = new soundContainer("assets/audio_files/Ambience/Wind Ambience.wav", audioCtx);
    wind.setGain(1.5);
    let windVoice;
    
    
    //Listeners
    const stepListeners = {
        //onHiPeakEvents: [() => foots.play()],
        onLoPeakEvents: [
            () => foots.playRandom(0, random(1, 1.1), random(0.1)),
            //() => console.log("asphalt lo peak")
        ]
    }

    const zXListeners = [
        //() => console.log("ZX"),
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
        /*
        console.log("asphalt load")
        windVoice = wind.play();
        windVoice.loop = true;

        function birdTrigger(){
            birds.playRandom(0, random(0.9, 1.8));
            birdTimeoutID = setTimeout(birdTrigger, random(3750))
        }

        birdTrigger();
        */
    }

    function onDeactivate(){
        /*
        windVoice.stop(0);
        windVoice = null;
        clearTimeout(birdTimeoutID);
        */
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

const asphaltSimulatorPreset = createAsphaltSimulatorSession();

MobileAppProcessors.push({
    simulatorSession: asphaltSimulatorPreset, 
    processorArray: asphaltSimulatorPreset.processors, 
    name: "Asphalt"
});


////////////////////////////////////////////////////////////////////////////////


function createGravelSimulatorSession(){
    //Setup Sounds
    const soundAddress = "assets/audio_files/Footsteps/Footstep gravel ";
    let addresses = [];
    for(let i = 0; i < 10; i++) addresses.push(soundAddress + (i +1) + ".wav");
    const foots = createRandomizer(addresses);

    const soundAddressBirds = "assets/audio_files/Ambience/Ambience bird";
    let birdaddresses = [];
    for(let i = 0; i < 10; i++) birdaddresses.push(soundAddressBirds + (i +1) + ".wav");
    const birds = createRandomizer(birdaddresses);
    birds.setAmp(0.1);
    let birdTimeoutID;

    const wind = new soundContainer("assets/audio_files/Ambience/Wind Ambience.wav", audioCtx);
    wind.setGain(1.5);
    let windVoice;

    //Listeners
    const stepListeners = {
        //onHiPeakEvents: [() => foots.play()],
        onLoPeakEvents: [() => foots.playRandom(0, random(1, 1.1), random(0.1))]
    }
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, stepListeners);
    const peakYProcessor = createPeakAnalyzer(defaultPeakSettings, null);
    const peakZProcessor = createPeakAnalyzer(defaultPeakSettings, null);
    const rawYProcessor = createDataBucket();
    const rawRotZProcessor = createDataBucket();
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings);

    //Processor Array
    const testProcessorArr = [
        {
            processor: peakXProcessor, 
            processorType: LOW_LEVEL_PROCESSOR_TYPES.PEAK, 
            sensorType: SENSOR_TYPES.ACCELERATION,
            dataType: DATA_TYPES.X
        },
        //{processor: rawYProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.Y},
        {processor: rawRotZProcessor, processorType: "rotation", axis: AXIS.Z},
        {processor: peakYProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.Y},
        {processor: peakZProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.Z},
        {processor: zeroXingProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X}
    ]



    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){
        windVoice = wind.play();
        windVoice.loop = true;

        function birdTrigger(){
            birds.playRandom(0, random(0.9, 1.8));
            birdTimeoutID = setTimeout(birdTrigger, random(3750))
        }

        birdTrigger();

        //Good place to set data offset
    }

    function onDeactivate(){
        //console.log(windVoice)
        if(windVoice) windVoice.stop(0);
        windVoice = null;
        clearTimeout(birdTimeoutID);
    }

    //Simulator Rendering
    function render(){
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel");
        renderDataCurve(peakYProcessor.data, 0.5, 60 + laneSpacing);
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2);
        renderDataCurve(rawRotZProcessor.data, 4, 60 + laneSpacing * 3)

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return testProcessorArr},
        get render(){return render}
    }
}

const gravelSimulatorPreset = createGravelSimulatorSession();
MobileAppProcessors.push({
    simulatorSession: gravelSimulatorPreset, 
    processorArray: gravelSimulatorPreset.processors, 
    name: "Gravel"
});


////////////////////////////////////////////////////////////////////////////////


function createMusicASimulatorSession(){
    //Setup Sounds
    let kick = new soundContainer("assets/audio_files/OskarMusic/Beat kick 1.wav", audioCtx);

    let percs = createRandomizer(["assets/audio_files/OskarMusic/Beat kick 1.wav",
        "assets/audio_files/OskarMusic/Beat snare 1.wav"
    ]);

    let rhode = new soundContainer("assets/audio_files/OskarMusic/Harmony Rhodes 1.wav", audioCtx);

    let vox = new soundContainer("assets/audio_files/OskarMusic//Percussive vox 2.wav", audioCtx);

    let melloAdresses = [
        "assets/audio_files/OskarMusic/Harmony piano 1.wav",
        "assets/audio_files/OskarMusic/Harmony Rhodes 1.wav",
        "assets/audio_files/OskarMusic/Percussive vox 2.wav",
        "assets/audio_files/OskarMusic/Harmony piano 2.wav",
        "assets/audio_files/OskarMusic/Harmony piano 3.wav",
        "assets/audio_files/OskarMusic/Harmony piano 4.wav",
    ]
    let mello = createRandomizer(melloAdresses);

    const hihatBaseAddress = "assets/audio_files/OskarMusic/Percussive hat ";
    let hihatAddresses = [];
    for(let i = 0; i < 2; i++) hihatAddresses.push(hihatBaseAddress + (i +1) + ".wav");
    let hats = createRandomizer(hihatAddresses);

    function rhodesTrigger(){
        let counter = 1;

        return function(){
            if(counter > 8) counter = 1;

            
            if( counter === 4) vox.play()
            counter++;
        }
    }

    let myRhodeTrig = rhodesTrigger();

    //Listeners
    const peakListeners = {
        onHiPeakEvents: [() => mello.playSequence(), myRhodeTrig],
        onLoPeakEvents: [() => percs.playSequence()]
    }
    
    const nullListeners = [
        //() => hats.playRandom(0, random(6, 7)),
        //myRhodeTrig
        //() => rhode.play()
    ]
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, peakListeners);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, nullListeners);

    //Processor Array
    const processorArr = [
        {processor: peakXProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X},
        {processor: zeroXingProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X}
    ]   


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){

    }

    function onDeactivate(){

    }

    //Simulator Rendering
    function render(){
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel Peaks");
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2, "Vertical Accel Null Points");

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return processorArr},
        get render(){return render}
    }
}

const musicASimulatorPreset = createMusicASimulatorSession();

MobileAppProcessors.push({
    simulatorSession: musicASimulatorPreset, 
    processorArray: musicASimulatorPreset.processors, 
    name: "Music Style 1"
});


////////////////////////////////////////////////////////////////////////////////


function createMusicBSimulatorSession(){
    //Setup Sounds

    let rhode1 = new soundContainer("assets/audio_files/OskarMusic/Harmony Rhodes 1.wav", audioCtx);
    let rhode2 = new soundContainer("assets/audio_files/OskarMusic/Harmony Rhodes 2.wav", audioCtx);
    let rhode3 = new soundContainer("assets/audio_files/OskarMusic/Harmony Rhodes 3.wav", audioCtx);
    let rhode5 = new soundContainer("assets/audio_files/OskarMusic/Harmony Rhodes 5.wav", audioCtx);

    let vox2 = new soundContainer("assets/audio_files/OskarMusic/Percussive vox 2.wav", audioCtx)
    let vox3 = new soundContainer("assets/audio_files/OskarMusic/Percussive vox 3.wav", audioCtx)
    vox3.setGain(0.5)

    let sub1 = new soundContainer("assets/audio_files/OskarMusic/Sub A.wav", audioCtx);
    let sub2 = new soundContainer("assets/audio_files/OskarMusic/Sub D.wav", audioCtx);

    function voxTrigger(){
        let counter = 1;

        return function(){
            if(counter > 8) counter = 1;
            if( counter === 2 ) vox2.play()
            if( counter === 4 ) vox2.play()
            if( counter === 6 ) vox2.play()
            if( counter === 8) vox3.play()
            counter++;
        }
    }

    let myVoxTrig = voxTrigger();

    function rhodeTrigger(){
        let counter = 1;

        return function(){
            if(counter > 16 ) counter = 1;

            if( counter <= 4) rhode1.play()
            if( counter > 4 && counter <= 6) rhode3.play()
            if( counter > 6 && counter <= 8) rhode2.play()
            if( counter > 8 && counter <= 15) rhode5.play()
            if( counter > 15) rhode3.play()

            counter++;
        }
    }

    let myRhodeTrig = rhodeTrigger();

    function subTrigger(){
        let counter = 1;

        return function(){
            if(counter > 16 ) counter = 1;
            if( counter == 1) sub1.play()
            if( counter == 9 )sub2.play()

            counter++;
        }
    }

    let mySubTrig = subTrigger();


    //Added the ambience as well thought it sounded nice in the background
    const soundAddressBirds = "assets/audio_files/Ambience/Ambience bird";
    let birdaddresses = [];
    for(let i = 0; i < 10; i++) birdaddresses.push(soundAddressBirds + (i +1) + ".wav");
    const birds = createRandomizer(birdaddresses);
    birds.setAmp(0.3);
    let birdTimeoutID;

    const wind = new soundContainer("assets/audio_files/Ambience/Wind Ambience.wav", audioCtx);
    wind.setGain(0.5);
    let windVoice;

    //Listeners
    const peakListeners = {
        onHiPeakEvents: [myVoxTrig],
        onLoPeakEvents: [myRhodeTrig,mySubTrig,] 
    }
    
    const nullListeners = [
       
    ]
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, peakListeners);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, nullListeners);

    //Processor Array
    const processorArr = [
        {processor: peakXProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X},
        {processor: zeroXingProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X}
    ]   


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){
        windVoice = wind.play();
        windVoice.loop = true;

        birdTimeoutID = setTimeout(() => {
            birds.playRandom(0, random(1, 1.1));
        }, random(750));
    }

    function onDeactivate(){
        windVoice.stop(0);
        windVoice = null;
        clearTimeout(birdTimeoutID);
    }

    //Simulator Rendering
    function render(){
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel Peaks");
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2, "Vertical Accel Null Points");

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return processorArr},
        get render(){return render}
    }
}

const musicBSimulatorPreset = createMusicBSimulatorSession();

MobileAppProcessors.push({
    simulatorSession: musicBSimulatorPreset, 
    processorArray: musicBSimulatorPreset.processors, 
    name: "Music Style 2"
});

////////////////////////////////////////////////////////////////////////////////

function createMusicCSimulatorSession(){
    //Setup Sounds

    const melloAddresses = [
        "assets/audio_files/DaveMusic/Mello01.wav",
        "assets/audio_files/DaveMusic/Mello02.wav",
        "assets/audio_files/DaveMusic/Mello03.wav",
        "assets/audio_files/DaveMusic/Mello04.wav",
    ]
    const mello = createRandomizer(melloAddresses);

    const bassAddresses = [
        "assets/audio_files/DaveMusic/Bass01.wav",
        "assets/audio_files/DaveMusic/Bass02.wav",
        "assets/audio_files/DaveMusic/Bass03.wav",
    ]
    let bass = createRandomizer(bassAddresses);

    const hhAddresses = [
        "assets/audio_files/DaveMusic/hh01.wav",
        "assets/audio_files/DaveMusic/hh02.wav",
        "assets/audio_files/DaveMusic/hh03.wav",
        "assets/audio_files/DaveMusic/hh04.wav",
    ]
    let hh = createRandomizer(hhAddresses);

    const percAddresses = [
        "assets/audio_files/DaveMusic/Perc01.wav",
        "assets/audio_files/DaveMusic/Perc02.wav",
        "assets/audio_files/DaveMusic/Perc03.wav",
    ]
    let perc = createRandomizer(percAddresses);

    let kick = new soundContainer("assets/audio_files/DaveMusic/Kick.wav", audioCtx);
    let clap = new soundContainer("assets/audio_files/DaveMusic/Clap01.wav", audioCtx);
    let impact = new soundContainer("assets/audio_files/DaveMusic/Impact.wav", audioCtx);

    function createMelloTrigger(){
        let counter = 1;

        return function(){
            if(counter > 8) counter = 1;
            if(counter === 4) mello.playSequence();
            if(counter === 8) mello.playSequence();
            counter++;
        }
    }

    let melloTrig = createMelloTrigger();

    function createBassTrigger(){
        let counter = 1;

        return function(){
            if(counter > 16 ) counter = 1;

            if( counter <= 4) bass.playSpecific(0);
            if(counter === 5) bass.playSpecific(2);

            if(counter >= 6 && counter <= 12 && counter % 2 === 0) bass.playSpecific(1);
            if(counter > 9 && counter % 2 !== 0) bass.playSpecific(0)
    

            counter++;
        }
    }

    let bassTrig = createBassTrigger();

    
    function createKickTrigger(){
        let counter = 1;

        return function(){
            if(counter > 4 ) counter = 1;
            if(counter % 2 === 0) kick.play(0, random(0.8, 1.2));

            counter++;
        }
    }

    let kickTrig = createKickTrigger();

    function createHHTrigger(){
        let counter = 1;

        return function(){
            if(counter > 4 ) counter = 1;
            if(counter % 2 === 0) hh.playRandom(0, random(0.8, 1.2), random(0, 0.2));

            counter++;
        }
    }

    let hhTrig = createHHTrigger();

    function createPercTrigger(){
        let counter = 1;

        return function(){
            if(counter > 8 ) counter = 1;
            if(counter % 2 === 0 && counter < 6) perc.playRandom();
            if(counter === 7) perc.playRandom();
            counter++;
        }
    }

    let percTrig = createPercTrigger();

    function createClapTrigger(){
        let counter = 1;

        return function(){
            if(counter > 8 ) counter = 1;
            if(counter % 3 === 0 && counter < 6) clap.play(0, random(0.8, 1.2), random(0, 0.2));
            if(counter % 2 === 0 && random() < 0.9) clap.play(0, random(0.8, 1.2), random(0, 0.2));
            counter++;
        }
    }

    let clapTrig = createClapTrigger();
    


    //Added the ambience as well thought it sounded nice in the background
    const soundAddressBirds = "assets/audio_files/Ambience/Ambience bird";
    let birdaddresses = [];
    for(let i = 0; i < 10; i++) birdaddresses.push(soundAddressBirds + (i +1) + ".wav");
    const birds = createRandomizer(birdaddresses);
    birds.setAmp(0.3);
    let birdTimeoutID;

    const wind = new soundContainer("assets/audio_files/Ambience/Wind Ambience.wav", audioCtx);
    wind.setGain(0.5);
    let windVoice;

    //Listeners
    const peakListeners = {
        onHiPeakEvents: [hhTrig],
        onLoPeakEvents: [kickTrig, melloTrig, clapTrig] 
    }
    
    const nullListeners = [
       bassTrig, hhTrig, percTrig
    ]
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, peakListeners);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, nullListeners);

    //Processor Array
    const processorArr = [
        {processor: peakXProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X},
        {processor: zeroXingProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X}
    ]   


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){
        windVoice = wind.play();
        windVoice.loop = true;

        function birdTrigger(){
            birds.playRandom(0, random(0.9, 1.8));
            birdTimeoutID = setTimeout(birdTrigger, random(3750))
        }

        birdTrigger();
    }

    function onDeactivate(){
        windVoice.stop(0);
        windVoice = null;
        clearTimeout(birdTimeoutID);
    }

    //Simulator Rendering
    function render(){
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel Peaks");
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2, "Vertical Accel Null Points");

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return processorArr},
        get render(){return render}
    }
}

const musicCSimulatorPreset = createMusicCSimulatorSession();

MobileAppProcessors.push({
    simulatorSession: musicCSimulatorPreset, 
    processorArray: musicCSimulatorPreset.processors, 
    name: "Music Style 3"
});


////////////////////////////////////////////////////////////////////////////////

function createSynthTestSimulatorSession(){
    //Setup Sounds
    let defaultPatch = {
        name: "",
        voiceGain: 0.05,
        oscWave: "triangle",
        oscPitch: 400,
        //get oscPitch(){return (Math.random(-1, 1)*60-30) + 200},
        ampDecay: 0.5,//4.8,
        lfoRate: 500,
        lfoDepth: 0,//4000,
        lfoWave: "square",
        infiniteSustain: true,
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

        const freks = [262, 295, 328, 349];
        

        return function(){
            if(counter > 4 ) counter = 1;
            if(counter % 2 === 0) {
                let note = freks[Math.floor(Math.random() * freks.length)];
                if(Math.random() < 0.2) note *= 2;
                
                synth1.applyDynamicPatchChange({oscPitch: note});
                //const wave = Object.values(ES1_LFO_TYPES)[Math.floor(Math.random()*Object.values(ES1_LFO_TYPES).length)];
                //synth1.applyDynamicPatchChange({lfoWave: wave});
            }

            counter++;
        }
    }

    let noteTrig = createNoteGen();




    


    //Listeners
    const peakListeners = {
        onHiPeakEvents: [noteTrig],
        onLoPeakEvents: [kickTrig] 
    }
    
    const nullListeners = [noteTrig]
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, peakListeners);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, nullListeners);

    //Processor Array
    const processorArr = [
        {processor: peakXProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X},
        {processor: zeroXingProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X}
    ]   


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){
        synth1.playVoice1(audioContext.currentTime);
    }

    function onDeactivate(){
        synth1.stop();
    }

    //Simulator Rendering
    function render(){
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel Peaks");
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2, "Vertical Accel Null Points");

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return processorArr},
        get render(){return render}
    }
}

const synthTestSimulatorPreset = createSynthTestSimulatorSession();

MobileAppProcessors.push({
    simulatorSession: synthTestSimulatorPreset, 
    processorArray: synthTestSimulatorPreset.processors, 
    name: "Synth Test"
});


////////////////////////////////////////////////////////////////////////////////

function createEnvTestSimulatorSession(){
    //Setup Sounds


    const loop1 = new MonoSound("assets/audio_files/Loops/GrainLoop.wav", audioCtx, {loop:true});
    const ampMod = new MultiEnv(audioCtx);
    const pitchMod = new MultiEnv(audioCtx);

    pitchMod.addStep({time:0, val:1});
    pitchMod.addStep({time:0.1, val:1.1, sustain:true});
    pitchMod.addStep({time:0.1, val:0.9, sustain:true});
    loop1.setPitchMod(pitchMod);

    function createTrigger(){
        let counter = 1;

        return function(){
            if(counter > 8) counter = 1;
            //if(counter === 4) mello.playSequence();
            //if(counter === 8) mello.playSequence();
            counter++;
        }
    }

    function createPitchEnvTrigger(){
        let counter = 1;

        return function(){
            if(counter > 8) counter = 1;
            //if(counter === 4) mello.playSequence();
            //if(counter === 8) mello.playSequence();
            pitchMod.trigger();
            counter++;
        }
    }
    const pitchEnvTrig = createPitchEnvTrigger();

   
    //Listeners
    const peakListeners = {
        onHiPeakEvents: [pitchEnvTrig],
        onLoPeakEvents: [pitchEnvTrig] 
    }
    
    const nullListeners = [
       
    ]
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, peakListeners);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, nullListeners);

    //Processor Array
    const processorArr = [
        {processor: peakXProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X},
        {processor: zeroXingProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X}
    ]   


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){
        loop1.play();
    }

    function onDeactivate(){
        loop1.stop();
    }

    //Simulator Rendering
    function render(){
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel Peaks");
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2, "Vertical Accel Null Points");

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return processorArr},
        get render(){return render}
    }
}

const envTestSimulatorPreset = createEnvTestSimulatorSession();

MobileAppProcessors.push({
    simulatorSession: envTestSimulatorPreset, 
    processorArray: envTestSimulatorPreset.processors, 
    name: "Env Test"
});



////////////////////////////////////////////////////////////////////////////////



function createGaitPhaseSimulatorSession(){
    //Setup Sounds


    const loop1 = new MonoSound("assets/audio_files/Loops/ElementEmitterLoop.wav", audioCtx, {loop:true});
    const loop2 = new MonoSound("assets/audio_files/Loops/ElementEmitterLoop.wav", audioCtx, {loop:true});
    const loop3 = new MonoSound("assets/audio_files/Loops/ElementEmitterLoop.wav", audioCtx, {loop:true});
    const loop4 = new MonoSound("assets/audio_files/Loops/ElementEmitterLoop.wav", audioCtx, {loop:true});
    const loop5 = new MonoSound("assets/audio_files/Loops/ElementEmitterLoop.wav", audioCtx, {loop:true});
    const loop6 = new MonoSound("assets/audio_files/Loops/ElementEmitterLoop.wav", audioCtx, {loop:true});
    const loop7 = new MonoSound("assets/audio_files/Loops/ElementEmitterLoop.wav", audioCtx, {loop:true});
    const loop8 = new MonoSound("assets/audio_files/Loops/ElementEmitterLoop.wav", audioCtx, {loop:true});

    const ampMod1 = new MultiEnv(audioCtx);
    const ampMod2 = new MultiEnv(audioCtx);
    const ampMod3 = new MultiEnv(audioCtx);
    const ampMod4 = new MultiEnv(audioCtx);
    const ampMod5 = new MultiEnv(audioCtx);
    const ampMod6 = new MultiEnv(audioCtx);
    const ampMod7 = new MultiEnv(audioCtx);
    const ampMod8 = new MultiEnv(audioCtx);

    const attack = 0.05
    const release = 0.08


    ampMod1.addStep({time:0, val:0.0});
    ampMod1.addStep({time:attack, val:1.0, sustain:true});
    ampMod1.addStep({time:release, val:0.0});

    ampMod2.addStep({time:0, val:0.0});
    ampMod2.addStep({time:attack, val:1.0, sustain:true});
    ampMod2.addStep({time:release, val:0.0});

    ampMod3.addStep({time:0, val:0.0});
    ampMod3.addStep({time:attack, val:1.0, sustain:true});
    ampMod3.addStep({time:release, val:0.0});

    ampMod4.addStep({time:0, val:0.0});
    ampMod4.addStep({time:attack, val:1.0, sustain:true});
    ampMod4.addStep({time:release, val:0.0});

    ampMod5.addStep({time:0, val:0.0});
    ampMod5.addStep({time:attack, val:1.0, sustain:true});
    ampMod5.addStep({time:release, val:0.0});

    ampMod6.addStep({time:0, val:0.0});
    ampMod6.addStep({time:attack, val:1.0, sustain:true});
    ampMod6.addStep({time:release, val:0.0});

    ampMod7.addStep({time:0, val:0.0});
    ampMod7.addStep({time:attack, val:1.0, sustain:true});
    ampMod7.addStep({time:release, val:0.0});

    ampMod8.addStep({time:0, val:0.0});
    ampMod8.addStep({time:attack, val:1.0, sustain:true});
    ampMod8.addStep({time:release, val:0.0});

    loop1.setGainMod(ampMod1);
    loop2.setGainMod(ampMod2);
    loop3.setGainMod(ampMod3);
    loop4.setGainMod(ampMod4);
    loop5.setGainMod(ampMod5);
    loop6.setGainMod(ampMod6);
    loop7.setGainMod(ampMod7);
    loop8.setGainMod(ampMod8);

    function createTrigger(){
        let counter = 1;

        return function(){
            if(counter > 8) counter = 1;
            //if(counter === 4) mello.playSequence();
            //if(counter === 8) mello.playSequence();
            counter++;
        }
    }

    function createAmpEnvTrigger(){
        let counter = 1;
        let first = true;

        return function(){
            if(counter > 8) counter = 1;

            if(counter === 1 || counter === 2){
                ampMod1.trigger();
                //console.log(counter);
            }
            if(counter === 2 || counter === 3){
                ampMod2.trigger();
                //console.log(counter);
            }
            if(counter === 3 || counter === 4){
                ampMod3.trigger();
                //console.log(counter);
            }
            if(counter === 4 || counter === 5){
                ampMod4.trigger();
                //console.log(counter);
            }
            if(counter === 5 || counter === 6){
                ampMod5.trigger();
                //console.log(counter);
            }
            if(counter === 6 || counter === 7){
                ampMod6.trigger();
                //console.log(counter);
            }
            if(counter === 7 || counter === 8){
                ampMod7.trigger();
                //console.log(counter);
            }
            if(counter === 8 || counter === 1){
                if(counter === 8){
                    first = false;
                    console.log("counter");
                } 

                if(!first) ampMod8.trigger();
                
            }
            
            counter++;
        }
    }
    const ampEnvTrig = createAmpEnvTrigger();


   
    //Listeners
    const peakListeners = {
        onHiPeakEvents: [ampEnvTrig],
        onLoPeakEvents: [ampEnvTrig] 
    }
    
    const nullListeners = [ampEnvTrig];
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, peakListeners);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, nullListeners);

    //Processor Array
    const processorArr = [
        {processor: peakXProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X},
        {processor: zeroXingProcessor, processorType: ACCELERATION_PROCESSOR_TYPES.PEAK, axis: AXIS.X}
    ]   


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){
        loop1.play(0,1);
        loop2.play(0,1.1);
        loop3.play(0,1.2);
        loop4.play(0,1.3);
        loop5.play(0,1.4);
        loop6.play(0,1.5);
        loop7.play(0,1.6);
        loop8.play(0,1.7);
        ampMod1.trigger();
        ampMod2.trigger();
        ampMod3.trigger();
        ampMod4.trigger();
        ampMod5.trigger();
        ampMod6.trigger();
        ampMod7.trigger();
        ampMod8.trigger();
        ampMod1.trigger();
        ampMod2.trigger();
        ampMod3.trigger();
        ampMod4.trigger();
        ampMod5.trigger();
        ampMod6.trigger();
        ampMod7.trigger();
        ampMod8.trigger();
    }

    function onDeactivate(){
        loop1.stop();
        loop2.stop();
        loop3.stop();
        loop4.stop();
        loop5.stop();
        loop6.stop();
        loop7.stop();
        loop8.stop();
    }

    //Simulator Rendering
    function render(){
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel Peaks");
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2, "Vertical Accel Null Points");

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return processorArr},
        get render(){return render}
    }
}

const gaitPhaseSimulatorPreset = createGaitPhaseSimulatorSession();

MobileAppProcessors.push({
    simulatorSession: gaitPhaseSimulatorPreset, 
    processorArray: gaitPhaseSimulatorPreset.processors, 
    name: "Gait Phase"
});






//Use speed to either modulate or change music (different music for different speeds)
//Use arpeggios for suggested running pace (DanceMakeMusic) since it is more forgiving
//with phase and tempo missmatches
//Music evolves during length of run
//Long tones for intervals (jump to hear the release of the long tone otherwise it gets cut off)

//Running in groups with speakers, different presets

//What event phase preferences do people have? (where should sounds be triggered)
//What kind/ character of sound matches particular event phases best?
//What kind of sounds do people prefer? (spectral and temporal qualities)
//What kind of sounds best match certain actions (toe up, heel down, etc...)
//What kind of sound align best temporally with actions? (ADSR, freq)
//What temporal placement of sound feels most natural?

//Dance
//What mappings trigger certain actions, most satisfying. (jump mapped to swish sound)

//Animate people's run data with sound/ music to enjoy later
//Games & Training jump on certain beats, match certain events (guitar hero) etc...
//Screenless interaction paradigm


//Robertp
//-Håkan Libdo sound bar
//-Hassan Lindetorp