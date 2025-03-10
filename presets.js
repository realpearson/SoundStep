const MobileAppProcessors = [];

//Temp Ugly Sound Stuf...
const soundAddressBirds = "assets/audio_files/Ambience/Ambience bird";
let birdaddresses = [];
for(let i = 0; i < 10; i++) birdaddresses.push(soundAddressBirds + (i +1) + ".wav");
const birds = createRandomizer(birdaddresses);

const wind = new soundContainer("assets/audio_files/Ambience/Wind Ambience.wav", audioCtx);



function createTestSimulatorSession(){
    //Setup Sounds
    const soundAddress = "assets/audio_files/Footsteps/Footstep asphalt ";
    let addresses = [];
    for(let i = 0; i < 10; i++) addresses.push(soundAddress + (i +1) + ".wav");
    const foots = createRandomizer(addresses);

    //Listeners
    const stepListeners = {
        //onHiPeakEvents: [() => foots.play()],
        onLoPeakEvents: [() => foots.play()]
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

    //Simulator Settings

    let windplay = false;
    //Simulator Rendering
    function render(){
        //if(!simulator) return;

        //simulator.increment();
        //if(Math.random()< 0.005) birds.play();
        if(!windplay){
            wind.play().loop = true;
            windplay = true;
        }

        //Render from processors rather than raw data (for now)
        renderDataCurve(peakXProcessor.data, 0.5, 60, "Vertical Accel");
        renderDataCurve(peakYProcessor.data, 0.5, 60 + laneSpacing);
        renderDataCurve(zeroXingProcessor.data, 0.5, 60 + laneSpacing * 2);
        renderDataCurve(rawRotZProcessor.data, 4, 60 + laneSpacing * 3)

        alignmentChecker();
    }

    return {
        get processors(){return testProcessorArr},
        get render(){return render}
    }
}

const testSimulatorPreset = createTestSimulatorSession();
MobileAppProcessors.push({processorArray: testSimulatorPreset.processors, name: "test preset"});


//Old reference
/*//This will be done by user later, now just testing...
//Test Listeners
const tlisteners = {
    //onHiPeakEvents: [() => testSound1.play()],
    onLoPeakEvents: [() => testSound2.play()]
}

//Test Processors
const peakXProcessor = createPeakAnalyzer(defaultPeakSettings, tlisteners);
const peakYProcessor = createPeakAnalyzer(defaultPeakSettings, null);
const peakZProcessor = createPeakAnalyzer(defaultPeakSettings, null);
const rawYProcessor = createDataBucket();
const rawRotZProcessor = createDataBucket();
const zeroXingProcessor = createZeroCrossingAnalyzer(defaultZeroCrossingSettings);

const testProcessorArr = [
    {processor: peakXProcessor, sensorType: "acceleration", axis: "x"},
    //{processor: rawYProcessor, sensorType: "acceleration", axis: "y"},
    {processor: rawRotZProcessor, sensorType: "rotation", axis: "z"},
    {processor: peakYProcessor, sensorType: "acceleration", axis: "y"},
    {processor: peakZProcessor, sensorType: "acceleration", axis: "z"},
    {processor: zeroXingProcessor, sensorType: "acceleration", axis: "x"}
] */