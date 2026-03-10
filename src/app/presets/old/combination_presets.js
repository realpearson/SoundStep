MobileAppProcessors = [];


//Footstep template
function createFootstepPreset(options){
    const {
        basePath,      
        numFiles = 10,
        ampRange = [1, 1.1],
        offsetRange = [0, 0.1]
    } = options;

    let addresses = [];
    for(let i = 0; i < numFiles; i++){
        addresses.push(basePath + (i + 1) + ".wav");
    }

    const foots = createRandomizer(addresses);

    const [minAmp, maxAmp] = ampRange;
    const [minOffset, maxOffset] = offsetRange;

    const stepListeners = {
        onLoPeakEvents: [() => foots.playRandom(
            0,
            random(minAmp, maxAmp),
            random(minOffset, maxOffset)
        )]
    };

    return {
        foots,
        stepListeners
    };
}

//Footstep types
const asphaltFootstepsPreset = () => createFootstepPreset({
    basePath: "assets/audio_files/Footsteps/Footstep asphalt ",
    numFiles: 10,
    ampRange: [1, 1.1],
    offsetRange: [0, 0.1]
});

const gravelFootstepsPreset = () => createFootstepPreset({
    basePath: "assets/audio_files/Footsteps/Footstep gravel ",
    numFiles: 10,
    ampRange: [1, 1.1],
    offsetRange: [0, 0.1]
});

const reactorFootstepsPreset = () => createFootstepPreset({
    basePath: "assets/audio_files/Footsteps/Footstep Reactor asphalt ",
    numFiles: 14,
    ampRange: [1, 1.1],
    offsetRange: [0, 0.1]
});



//Ambience template
function createAmbiencePreset(options = {}){
    const {
        basePath, 
        birdAmp = 0.3,
        windGain = 1.5
    } = options;

    const soundAddressBirds = "assets/audio_files/Ambience/Ambience bird";
    let birdaddresses = [];
    for(let i = 0; i < 10; i++) birdaddresses.push(soundAddressBirds + (i +1) + ".wav");
    const birds = createRandomizer(birdaddresses);
    birds.setAmp(birdAmp);
    let birdTimeoutID;

    const wind = new soundContainer(basePath, audioCtx);
    wind.setGain(windGain);
    let windVoice;

    function onActivate(){
        windVoice = wind.play();
        windVoice.loop = true;

        function birdTrigger(){
            birds.playRandom(0, random(0.9, 1.8));
            birdTimeoutID = setTimeout(birdTrigger, random(3750));
        }

        birdTrigger();
    }

    function onDeactivate(){
        if(windVoice){
            windVoice.stop(0);
            windVoice = null;
        }
        clearTimeout(birdTimeoutID);
    }

    return {
        onActivate,
        onDeactivate
    };
}

//variants
const softAmbiencePreset  = () => createAmbiencePreset({basePath:"assets/audio_files/Ambience/Wind Ambience.wav", birdAmp: 0.03, windGain: 1.5 });
const reactorAmbiencePreset  = () => createAmbiencePreset({basePath:"assets/audio_files/Ambience/Reactor Ambience.wav", birdAmp: 0.0, windGain: 0.3 });
const noAmbiencePreset    = () => ({
    onActivate(){},
    onDeactivate(){}
});




//combien
function createRunSimulatorSession(stepPresetFactory, ambiencePresetFactory, name){
    const stepPreset = stepPresetFactory();       
    const ambiencePreset = ambiencePresetFactory(); 

    // Processors (same as before)
    const peakXProcessor   = createPeakAnalyzer(defaultPeakSettings, stepPreset.stepListeners);
    const peakYProcessor   = createPeakAnalyzer(defaultPeakSettings, null);
    const peakZProcessor   = createPeakAnalyzer(defaultPeakSettings, null);
    const rawYProcessor    = createDataBucket();
    const rawRotZProcessor = createDataBucket();
    const zeroXingProcessor= createZeroCrossingAnalyzer(defaultZeroCrossingSettings);

    const processorArr = [
        {processor: peakXProcessor,   sensorType: "acceleration", axis: "x"},
        {processor: rawRotZProcessor, sensorType: "rotation",     axis: "z"},
        {processor: peakYProcessor,   sensorType: "acceleration", axis: "y"},
        {processor: peakZProcessor,   sensorType: "acceleration", axis: "z"},
        {processor: zeroXingProcessor,sensorType: "acceleration", axis: "x"}
    ];

    function onActivate(){
        ambiencePreset.onActivate();
    }

    function onDeactivate(){
        ambiencePreset.onDeactivate();
    }

    function render(){
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel");
        renderDataCurve(peakYProcessor.data, 0.5, 60 + laneSpacing);
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2);
        renderDataCurve(rawRotZProcessor.data, 4, 60 + laneSpacing * 3);

        alignmentChecker();
    }

    return {
        get onActivate(){return onActivate},
        get onDeactivate(){return onDeactivate},
        get processors(){return processorArr},
        get render(){return render},
        name
    };
}





//Create presets
// Asphalt + ambience
const asphaltWithAmbienceSession = createRunSimulatorSession(
    asphaltFootstepsPreset,
    softAmbiencePreset,
    "Asphalt + Ambience"
);
MobileAppProcessors.push({
    simulatorSession: asphaltWithAmbienceSession,
    processorArray: asphaltWithAmbienceSession.processors,
    name: asphaltWithAmbienceSession.name
});

// Gravel + ambience
const gravelWithAmbienceSession = createRunSimulatorSession(
    gravelFootstepsPreset,
    softAmbiencePreset,
    "Gravel + ambience"
);
MobileAppProcessors.push({
    simulatorSession: gravelWithAmbienceSession,
    processorArray: gravelWithAmbienceSession.processors,
    name: gravelWithAmbienceSession.name
});


//no ambience:
const gravelNoAmbienceSession = createRunSimulatorSession(
    gravelFootstepsPreset,
    noAmbiencePreset,
    "Gravel (dry)"
);
MobileAppProcessors.push({
    simulatorSession: gravelNoAmbienceSession,
    processorArray: gravelNoAmbienceSession.processors,
    name: gravelNoAmbienceSession.name
});


//Reactor:
const nuclearReactorAmbienceSession = createRunSimulatorSession(
    reactorFootstepsPreset,
    reactorAmbiencePreset,
    "Reactor + Reactor"
);

MobileAppProcessors.push({
    simulatorSession: nuclearReactorAmbienceSession,
    processorArray: nuclearReactorAmbienceSession.processors,
    name: nuclearReactorAmbienceSession.name

});

//Gravel + Reactor:
const gravelReactorAmbienceSession = createRunSimulatorSession(
    gravelFootstepsPreset,
    reactorAmbiencePreset,
    "Gravel + Reactor"
);
MobileAppProcessors.push({
    simulatorSession: gravelReactorAmbienceSession,
    processorArray: gravelReactorAmbienceSession.processors,
    name: gravelReactorAmbienceSession.name
});


