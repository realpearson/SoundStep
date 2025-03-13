const MobileAppProcessors = [];



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
        {processor: peakXProcessor, sensorType: "acceleration", axis: "x"},
        //{processor: rawYProcessor, sensorType: "acceleration", axis: "y"},
        {processor: rawRotZProcessor, sensorType: "rotation", axis: "z"},
        {processor: peakYProcessor, sensorType: "acceleration", axis: "y"},
        {processor: peakZProcessor, sensorType: "acceleration", axis: "z"},
        {processor: zeroXingProcessor, sensorType: "acceleration", axis: "x"}
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

const asphaltSimulatorPreset = createAsphaltSimulatorSession();
MobileAppProcessors.push({
    simulatorSession: asphaltSimulatorPreset, 
    processorArray: asphaltSimulatorPreset.processors, 
    name: "Asphalt"
});


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
        {processor: peakXProcessor, sensorType: "acceleration", axis: "x"},
        //{processor: rawYProcessor, sensorType: "acceleration", axis: "y"},
        {processor: rawRotZProcessor, sensorType: "rotation", axis: "z"},
        {processor: peakYProcessor, sensorType: "acceleration", axis: "y"},
        {processor: peakZProcessor, sensorType: "acceleration", axis: "z"},
        {processor: zeroXingProcessor, sensorType: "acceleration", axis: "x"}
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
        {processor: peakXProcessor, sensorType: "acceleration", axis: "x"},
        {processor: zeroXingProcessor, sensorType: "acceleration", axis: "x"}
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

//The new music preset, havent changed the name though
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
        {processor: peakXProcessor, sensorType: "acceleration", axis: "x"},
        {processor: zeroXingProcessor, sensorType: "acceleration", axis: "x"}
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



//CreateAsphaltSim
//CreateGravelSim
//CreateMusicSim
