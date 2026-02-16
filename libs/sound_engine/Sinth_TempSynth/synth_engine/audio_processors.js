//https://googlechromelabs.github.io/web-audio-samples/audio-worklet/

class SampleHoldGen extends AudioWorkletProcessor{
  #nodeActive = true;
  //States
  #interval = "fixed";
  #interpolate = false;
  //burst (static, crackling)
  //Buffers
  #frameCount = 0;
  #targetValue = 0;
  #currentValue = Math.random() * 2 -1;  
  #newTarget = false;
  #interpolationInc = 0;
  #frameThresh = 0;
  
  //https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/AudioWorkletProcessor
  //options info
  constructor(_options){
    
    super(_options);
    if(_options?.processorOptions?.interval) this.#interval = _options.processorOptions.interval;
    if(_options?.processorOptions?.interpolate) this.#interpolate = _options.processorOptions.interpolate;
      
    //https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode/port
    this.port.onmessage = (_e) =>{
      if(_e.data.interval) this.#interval = _e.data.interval;
      if(_e.data.interpolate) this.#interpolate = _e.data.interpolate;
      if(_e.data.nodeActive != undefined) this.#nodeActive = false;
    }
  }
  
  static get parameterDescriptors(){
    return [
      {
        name: "rate",
        defaultValue: 440,
        minValue: 0.1,
        maxValue: 48000
      }
    ]
  }

  //Public Properties
  get interval() {return interval}
  set interval(_val){interval = _val === "fixed" || _val === "random" ? _val : interval}
  get interpolate(){return interpolate}
  set interpolate(_val){if((typeof _val) === "boolean") interpolate = _val}
  
  process(inputs, outputs, parameters){    
    //Params
    const rate = parameters.rate; //A-rate vs k-rate?
    const rateInFrames = Math.floor(sampleRate/rate); //can we move this to private vars? 
     
    outputs.forEach((output)=>{
      output.forEach((ch)=>{        
        for(let i = 0; i < ch.length; i++){
          this.#frameCount++;
          
          //Set Frame Thresh
          this.#frameThresh = this.#interval === "fixed" ? rateInFrames : this.#frameThresh;
             
          //Generate New Value
          if(this.#frameCount >= this.#frameThresh){
            this.#frameCount = 0;
            this.#newTarget = true;
            this.#currentValue = this.#targetValue;
            this.#targetValue = Math.random() * 2 -1;
            
            if(this.#interval === "random"){
              this.#frameThresh = Math.floor(Math.random() * rateInFrames);
            }
          }
               
          if(this.#interpolate){
            if(this.#newTarget){
              this.#interpolationInc = (this.#targetValue-this.#currentValue)/ this.#frameThresh;
              this.#newTarget = false;
            }
          
            this.#currentValue += this.#interpolationInc;
          } 
          else {this.#currentValue = this.#targetValue}
          
             
          ch[i] = this.#currentValue;
        }
      });
    });

    //if(outputs.length) return true;
    return this.#nodeActive;
  }
}

registerProcessor("sample-hold-gen", SampleHoldGen);
      
      
      