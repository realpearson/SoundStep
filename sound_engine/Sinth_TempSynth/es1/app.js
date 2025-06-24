//Store session patches, add to dropdown to select a patch
const patches = [];
const mySynth = createES1();



//https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
//https://stackoverflow.com/questions/13709482/how-to-read-text-file-in-javascript
function downloadPatch(_patch, _name){
  let a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(_patch)], {type:'text/plain'}));
  a.download = _name + ".json";
  a.click();
  URL.revokeObjectURL(a);
  //console.log(a.parentNode)
  //document.removeChild(a);
}

//https://editor.p5js.org/amcc/sketches/_pnyek8kr
//https://developer.mozilla.org/en-US/docs/Web/API/fetch
//https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/
//https://stackoverflow.com/questions/54617844/using-filereader-to-read-a-json-file
function uploadFiles() {
  const fileList = this.files; /* now you can work with the file list */
  const file = fileList[0]
  console.log(file)
  console.log(file.type)

  const reader = new FileReader();

  reader.onload = function(e) {
    if(file.type === 'application/json'){
      //loadPatch(JSON.parse(file));
      console.log(e.target.result)
      fetch(e.target.result)
        .then((response) => response.json())
        .then((json) => {
        loadPatch(json);
        savePatch(json.name);
      });
    }
  }

  reader.readAsDataURL(file);
}

//window.addEventListener("mousedown", ()=> downloadPatch(data, "mydata"))
window.addEventListener("mousedown", ()=> {
  audioContext.resume();
}, {once:true});

window.addEventListener("mousedown", ()=> {
  if(!modulesLoaded) return;
  //mySynth.playVoice1(audioContext.currentTime + audioContext.baseLatency);
});

window.addEventListener("keydown", (_e) => {

})
