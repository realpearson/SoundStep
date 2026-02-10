//---------------------------------Device Permissions-------------------------------------//
function requestSensorPermission() {
  if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    alert("enter"); //Do we need this?
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        alert("resp" + response);
        if (response == "granted") {
          //do we need to do anything here or is this enough
          //for p5 to take over and start working?
        }
      }).catch(console.error);
  } //else-> DeviceMotionEvent is not defined
}



//---------------------------------Import Export Data-------------------------------------//

//Export run data from mobile application
function exportData(data){
  let a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type:'text/plain'}));
  a.download = "runData" + ".json";
  a.click();
  URL.revokeObjectURL(a);
  //console.log(a.parentNode)
  //document.removeChild(a);
}



//Upload local RUN data from COMPUTER FINDER
function uploadData(onUploaded) {
  const fileList = this.files; /* now you can work with the file list */
  const file = fileList[0]
  //console.log(file)
  //console.log(file.type)

  const reader = new FileReader();

  reader.onload = function(e) {
    if(file.type === 'application/json'){
      //console.log(e.target.result)
      fetch(e.target.result)
        .then((response) => response.json())
        .then((json) => {
          //onUploaded(json);
          //simulator = createSimulator(json);
          onImportData(json)
      });
    }
  }

  reader.readAsDataURL(file);
}

//This is still very ugly...
//Called by fetch in datahandler.js
function onImportData(data){
  currentData = data;
  simulator = createSimulator(data);
  //simulator.setDataPos(450);
}




//Upload local RUN data FROM PROJECT FOLDER to sandbox mode
async function fetchLocalData(event){
  if(event.target.value){
    const requestURL = event.target.value;
    const request = new Request(requestURL);
    const response = await fetch(request);
    const data = await response.json();
    currentData = data;
    simulator = createSimulator(data);
    //Dont hard code this...
    //simulator.loadPreset(asphaltWithAmbienceSession);
    //simulator.setDataPos(500);
  }
}