//Structure which presets should be loaded into App

//Preset Arrays
MobileAppProcessors = [];


//Instantiate Preset Objects
const C1SimulatorPreset = makePresetObject(createC1SimulatorSession(), "C1 Heavy");
const C2SimulatorPreset = makePresetObject(createC2SimulatorSession(), "C2 Light");
const runMusicSimulatorPreset = makePresetObject(createRunMusicSimulatorSession(), "Run Music");


//Add Preset Objects To Preset Arrays
MobileAppProcessors.push(C1SimulatorPreset);
MobileAppProcessors.push(C2SimulatorPreset);
MobileAppProcessors.push(runMusicSimulatorPreset);


//Helper for creating preset objects
function makePresetObject(preset, name){
    return {
        simulatorSession: preset,
        processorArray: preset.processors,
        name
    }
}