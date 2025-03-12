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

    const hihatBaseAddress = "assets/audio_files/OskarMusic/Percussive hat ";
    let hihatAddresses = [];
    for(let i = 0; i < 6; i++) hihatAddresses.push(hihatBaseAddress + (i +1) + ".wav");
    let hats = createRandomizer(hihatAddresses);

    //Listeners
    const peakListeners = {
        onHiPeakEvents: [() => kick.play()],
        onLoPeakEvents: [() => hats.playRandom(0, random(1, 1.1))]
    }
    
    const nullListeners = [
        () => hats.playRandom(0, random(1, 1.1)),
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



//CreateAsphaltSim
//CreateGravelSim
//CreateMusicSim
