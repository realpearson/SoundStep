

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



function createCollabMusicSimulatorSession(){
    //Setup Sounds

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
    for(let i = 0; i < 2; i++) drumAddresses.push(drumPath + (i +1) + ".wav");
    const drums = createRandomizer(drumAddresses);


    function alternatePair(counter, baseIndex){
    return baseIndex + (counter % 2);
    }


    //Triggers
    let counter = 1;
    let counter3 = 1

    function chordTrigger(){
        
        return function(){
            if(counter > 8 ) counter = 1;

            if(counter <= 2){chords.playSpecific(alternatePair(counter, 0));
                //console.log(alternatePair(counter,0));
            }
            else if(counter > 2 && counter <= 5){chords.playSpecific(alternatePair(counter, 3));
                //console.log(alternatePair(counter,3));
            }
            else if(counter > 5 && counter <= 8){chords.playSpecific(alternatePair(counter, 6));
                //console.log(alternatePair(counter,6));
            }
            
            counter++
            counter3++;
        }
    }

    function bassTrigger(){

        return function(){
            let counter2 = counter - 1;

            if(counter2 <= 2){bass.playSpecific(alternatePair(counter2, 0));
            }
            else if(counter2 > 2 && counter2 <= 5){bass.playSpecific(alternatePair(counter2, 2));
            }
            else if(counter2 > 5 && counter2 <= 8){bass.playSpecific(alternatePair(counter2, 5));
            }
            
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

        return function(){
            if(counter4 > 8 ) counter4 = 1;

            if(counter4 == 1){drums.playSpecific(0);}

            if(counter4 == 5){drums.playSpecific(1);}
            if(counter4 == 8){drums.playRandom();}
          

            counter4++;
          
            
        }
    }
    

    //Listeners
    const peakListeners = {
        onHiPeakEvents: [chordTrigger(), () => pads.playSequence(), () => percs.playRandom()],
        onLoPeakEvents: [bassTrigger(),pluckTrigger(),() => percs.playRandom(), drumTrigger()] //[() => bass.playSequence()]
    }

    //
    
    const nullListeners = [ 
    ]
    //() => bleeps.playRandom(0, random(1, 1.1), random(0.1))
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
        bass.setAmp(0.4);
        bleeps.setAmp(0.1)
        pads.setAmp(0.5)
        percs.setAmp(0.4)
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

const collabMusicSimulatorPreset = createCollabMusicSimulatorSession();

MobileAppProcessors.push({
    simulatorSession: collabMusicSimulatorPreset, 
    processorArray: collabMusicSimulatorPreset.processors, 
    name: "Collab Music Full"
});