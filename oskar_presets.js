

function createReactorSimulatorSession(){
    //Setup Sounds
    const soundAddress = "assets/audio_files/Footsteps/Footstep Reactor asphalt ";
    let addresses = [];
    for(let i = 3; i < 16; i++) addresses.push(soundAddress + (i +1) + ".wav");
    const foots = createRandomizer(addresses);


    const ambience = new soundContainer("assets/audio_files/Ambience/Reactor Ambience.wav", audioCtx);
    ambience.setGain(0.3);
    let ambVoice;

    //Listeners
    const stepListeners = {
        //onHiPeakEvents: [() => foots.play()],
        onLoPeakEvents: [() => foots.playRandom(0, random(1, 1.1), random(0.1))]
    }
    
    const nullListeners = [
    ]
    
    //....

    //Processors
    const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, stepListeners);
    const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings, nullListeners);

    //Processor Array
    const processorArr = [
        {processor: peakXProcessor, sensorType: "acceleration", axis: "x"},
        {processor: zeroXingProcessor, sensorType: "acceleration", axis: "x"}
    ]   


    //These need to get called in both simulator and runrecorder!!!!
    function onActivate(){
        ambVoice = ambience.play();
        ambVoice.loop = true;

        
    }

    function onDeactivate(){
        ambVoice.stop(0);
        ambVoice = null;
      
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

const reactorSimulatorPreset = createReactorSimulatorSession();

window.MobileAppProcessors.push({
    simulatorSession: reactorSimulatorPreset, 
    processorArray: reactorSimulatorPreset.processors, 
    name: "Nuclear reactor"
});