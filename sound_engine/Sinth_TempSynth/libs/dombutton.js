const clickBehavior = {
  toggle: "toggle",
  hold: "hold",
  press: "press",
};

let buttonStyle1 = {
  buttonCol: "#383836",
  buttonClickCol: "#3ab51b",
  borderCol: "solid black",
  borderWidth: "2px",
  clickType: clickBehavior.toggle,
};

let buttonStyle2 = {
  buttonCol: "#a19e97",
  buttonClickCol: "#3ab51b",
  borderCol: "solid black",
  borderWidth: "1px",
  clickType: clickBehavior.press,
};

let buttonStyle3 = {
  buttonCol: "#757373",
  buttonClickCol: "#3ab51b",
  borderCol: "solid black",
  borderWidth: "2px",
  clickType: clickBehavior.toggle,
};

let buttonStyle4 = {
  buttonCol: "black",
  buttonClickCol: "#3ab51b",
  borderCol: "solid black",
  borderWidth: "1px",
  clickType: clickBehavior.press,
};

function button(_params) {
  this.index = _params.index || 0; //Used by button groups

  let buttonCol = "rgb(220, 220, 220)";
  let buttonClickCol = "#3ab51b";
  let borderCol = "solid black";
  let borderWidth = "2px";
  let clickType = _params.clickType || clickBehavior.toggle;
  let toggleState = 0;
  //let useImage = false;
  let zIndex = _params.zIndex || 0;
  let datasetAction = _params.datasetAction || "none";
  let id = _params.id;

  /* INITIALIZATION */
  let buttonContainer = _params.parent
    ? _params.parent.getNewContainer(this)
    : document.createElement("div"); //Create Div Element
  let p = document.createElement("p");
  let t = document.createElement("table");
  let r;

  let buttonImg = document.createElement("IMG");
  buttonImg.style.position = "absolute";

  let pX = _params.posX || 0;
  let pY = _params.posY || 0;
  buttonContainer.style.position = "absolute";
  buttonContainer.style.left = pX.toString() + "px"; //Pos X
  buttonContainer.style.top = pY.toString() + "px"; //Pos Y
  let sX = _params.sizeX || 20;
  let sY = _params.sizeY || 20;
  buttonContainer.style.width = sX.toString() + "px"; //Width
  buttonContainer.style.height = sY.toString() + "px"; //Height
  //buttonContainer.style.color = 'blue';
  buttonContainer.style.border = borderCol;
  buttonContainer.style.borderWidth = borderWidth;
  buttonContainer.style.backgroundColor = buttonCol;
  buttonContainer.style.cursor = 'pointer';
  buttonContainer.style.zIndex = zIndex;
  buttonContainer.value = 0; 

  buttonContainer.style.zIndex = _params.zIndex || 0;
  buttonContainer.dataset.buttonIndex = this.index;
  if (datasetAction) buttonContainer.dataset.action = datasetAction;
  if (id) buttonContainer.id = id;

  if (_params.parent) _params.parent.getElement().appendChild(buttonContainer);
  else document.body.appendChild(buttonContainer);

  this.getElement = function(){return this.buttonContainer}
  let evListeners = [];
  
  //Button Events
  this.pushButton = function () {
    switch (clickType) {
      case clickBehavior.toggle:
        toggleState
          ? (buttonContainer.style.backgroundColor = buttonCol)
          : (buttonContainer.style.backgroundColor = buttonClickCol);
        toggleState = toggleState === 0 ? 1 : 0;
        buttonContainer.value = toggleState;
        for(let ev of evListeners) ev(buttonContainer.value); //Call listeners
        break;

      case clickBehavior.hold:
        toggleState = buttonContainer.value = 1;
        buttonContainer.style.backgroundColor = buttonClickCol;
        for(let ev of evListeners) ev(buttonContainer.value); //Call listeners
        break;

      case clickBehavior.press:
        buttonContainer.style.backgroundColor = buttonClickCol;
        toggleState = buttonContainer.value = 1;
        for(let ev of evListeners) ev(); //Call listeners
        setTimeout(
          () => {
            buttonContainer.style.backgroundColor = buttonCol;
            toggleState = buttonContainer.value = 0;
            //for(let ev of evListeners) ev(buttonContainer.value); //Call listeners
          },
          70
        );
        break;
    }
  }

  this.releaseButton = function () {
    if (clickType == clickBehavior.hold){
      buttonContainer.style.backgroundColor = buttonCol;
      toggleState = buttonContainer.value = 0;
      for(let ev of evListeners) ev(buttonContainer.value); //Call listeners
    }
      
  }

  if (!_params.datasetAction){
    buttonContainer.addEventListener("mousedown", this.pushButton);
    window.addEventListener("mouseup", this.releaseButton);
  }
   
  this.delegateEvents = function(_e, _globalListener){
    this.pushButton();
    if(clickType == clickBehavior.hold) _globalListener.setMouseUp(this.releaseButton);
  }
  

  this.setButtonType = function (_clickType) {
    clickType = _clickType;
  }

  this.setState = function (_togglestate) {
    toggleState = _togglestate ? 1 : 0;
    buttonContainer.value = toggleState;
    if (_togglestate) buttonContainer.style.backgroundColor = buttonClickCol;
    else buttonContainer.style.backgroundColor = buttonCol;
  }

  this.getState = function () {
    return parseInt(toggleState);
  }

  this.setBorderCol = function (_col) {
    buttonContainer.style.border = "solid " + _col;
    buttonContainer.style.borderWidth = "2px";
  }

  this.addListener = function (_type, _callback) {
    if (typeof _callback === "function")
      if(_type == "onbuttonpress") evListeners.push(_callback);
      else buttonContainer.addEventListener(_type, _callback);
    else throw Error("Argument must be a function");
  }

  //Set the position of the button
  this.setPos = function (_x, _y) {
    pX = _x;
    pY = _y;
    buttonContainer.style.left = _x.toString() + "px";
    buttonContainer.style.top = _y.toString() + "px";
  }
  
  this.remove = function () {
    console.log("remo");
    buttonContainer.innerHTML = "";
    buttonContainer.remove();
    window.removeEventListener("mouseup", this.clickColRel);
  }

  this.useIMG = function (_imgAdd) {
    buttonImg.src = _imgAdd;
    buttonImg.width = sX.toString();
    buttonImg.height = sY.toString();
    buttonImg.style.imageRendering = "pixelated";
    buttonContainer.appendChild(buttonImg);
  }

  this.addText = function (_txt, _size, _off, _col) {
    let r = t.insertRow(0);
    let c = r.insertCell(0);
    if (_off != undefined) {
      c.style.position = "absolute";
      c.style.left = (_off.x + pX).toString() + "px";
      c.style.top = (_off.y + pY).toString() + "px";
    }
    c.innerHTML = _txt;
    c.style.fontSize = _size || "8pt";
    c.style.textAlign = "center";
    c.style.color = _col || "rgb(0, 0, 0)";

    t.style.width = buttonContainer.clientWidth.toString() + "px";
    t.style.height = buttonContainer.clientHeight.toString() + "px";
    //t.style.background = 'white';

    buttonContainer.appendChild(t);
  }

  this.setCols = function (_col, _clkCol, _borderCol) {
    buttonCol = _col || buttonCol;
    buttonClickCol = _clkCol || buttonClickCol;
    borderCol = _borderCol || borderCol;

    buttonContainer.style.border = borderCol;
    buttonContainer.style.borderWidth = borderWidth;
    buttonContainer.style.backgroundColor = buttonCol;
  }

  this.loadStyle = function (_style) {
    buttonCol = _style.buttonCol;
    buttonClickCol = _style.buttonClickCol;
    borderCol = _style.borderCol;
    borderWidth = _style.borderWidth;
    clickType = _style.clickType;

    buttonContainer.style.border = borderCol;
    buttonContainer.style.borderWidth = borderWidth;
    buttonContainer.style.backgroundColor = buttonCol;
  }

  this.show = function (_show) {
    if (_show) buttonContainer.style.display = "block";
    else buttonContainer.style.display = "none";
  }

  this.setId = function (_id) {
    id = _id;
    el.id = id;
  }

  this.setDataAction = function (_action) {
    datasetAction = _action;
    el.dataset.action = _action;
  }

  this.setZIndex = function (_zIndex) {
    zIndex = _zIndex; //Do we need these vars?
    el.style.zIndex = _zIndex;
  }
}

function buttonGroup(_params) {
  let buttons = [];
  let spacing = _params.spacing || 5;
  let layout = _params.layout || "vertical";

  let size = _params.size || 10;
  let posX = _params.posX || 0;
  let posY = _params.posY || 0;
  let numButtons = _params.numButtons || 4;

  let val = _params.defaultValue || 0;

  let canBeFocused = true;
  let focusColor = "red";

  let isToggle = true;
  let dataActions = _params.dataActions || []; //Expecting array if not left undefined

  //DOM
  //let groupContainer = _params.divEl || document.createElement("div");
  let groupContainer = _params.parent
    ? _params.parent.getNewContainer(this)
    : document.createElement("div"); //Create Div Element

  groupContainer.style.position = "absolute";
  groupContainer.style.left = posX.toString() + "px";
  groupContainer.style.top = posY.toString() + "px";
  groupContainer.style.border = "1px solid transparent";
  //groupContainer.style.background = "blue";
  groupContainer.value = val;

  if (_params.parent) _params.parent.getElement().appendChild(groupContainer);
  else document.body.appendChild(groupContainer);

  //Events
  let printVal = function (_val) {
    console.log("button group val " + _val);
  }

  let evListeners = []; //[printVal];

  //Toggle function for button toggle mode
  this.toggleButton = function (_buttonIndex) {
    if (!isToggle) return;
    _buttonIndex = _buttonIndex.target != undefined ? 
      _buttonIndex.target.dataset.buttonIndex : _buttonIndex;
    for (let b = 0; b < numButtons; b++) {
      if (_buttonIndex != b) buttons[b].setState(false);
      else {
        groupContainer.value = val = b;
        for (let li of evListeners) li(val);
        buttons[val].setState(true);
      }
    }
  }

  //Setup Button Group
  for (let i = 0; i < numButtons; i++) {
    buttons[i] = new button({
        posX: layout == 'vertical' ? posX : posX + size * i + spacing * i,
        posY: layout == 'vertical' ? posY + size * i + spacing * i : posY,
        sizeX: size,
        sizeY: size,
        parent: _params.parent,
        index: i,
        datasetAction: dataActions.length > i ? dataActions[i] : undefined,
      });
    
      //Event Handler
    if (dataActions.length == 0 && isToggle) buttons[i].addListener("mousedown", () => this.toggleButton(i));
  }
  const m1 = (size + 4).toString() + "px";
  const m2 = (size * numButtons + 5 * numButtons - 1).toString() + "px";
  
  groupContainer.style.width = layout == 'vertical' ? m1 : m2;
  groupContainer.style.height = layout == 'vertical' ? m2 : m1;



  buttons[val].setState(true);

  this.isToggle = function (_istoggle) {
    isToggle = _istoggle;
  }

  this.setPos = function (_posX, _posY, _spacing) {
    spacing = _spacing || spacing;
    for (let i = 0; i < _numButtons; i++) {
      if (layout == "vertical") {
        buttons[i].setPos(_posX, _posY + _size * i + spacing * i);
      } else if (layout == "horizontal") {
        buttons[i].setPos(_posX + _size * i + spacing * i, _posY);
      }
    }
    groupContainer.style.left = (_posX - 1).toString() + "px";
    groupContainer.style.top = (_posY - 1).toString() + "px";
    posX = _posX;
    posY = _posY;
  }

  this.remove = function () {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].remove();
    }
    groupContainer.innerHTML = "";
    groupContainer.remove();
  }

  this.setLayout = function (_layout) {
    //
  }
  
  this.useIMG = function (_adrss) {
    if (_adrss.length != buttons.length)
      throw Error("Must have same num images as buttons rcvvd:" + _adrss.length);
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].useIMG(_adrss[i]);
    }
  }

  this.getVal = function (_index) {
    return isToggle ? val : buttons[_index].getState();
  }
  
  this.setVal = function (_val) {
    if (!isToggle)
      //_val is an array of true / false states for each button in the group
      for (let i = 0; i < buttons.length; i++) buttons[i].setState(_val[i]);
    else if (_val >= 0 && _val < buttons.length) {
      //_val is an int / array index of which button to set to true/ on state
      this.toggleButton(_val);
      groupContainer.value = val = _val;
    } else throw Error("Button group value outside of range");
  }

  this.getRange = function () {
    return buttons.length;
  }

  this.addListener = function (_type, _func, _index) {
    if (_type == "ongroupchange") {
      if (typeof _func === "function") {
        evListeners.push(_func);
      } else throw Error("Argument must be a function");
      if (_index != undefined)
        throw Error("Cannot assign 'onchange' to single button index");
    } else if (_type == "mousedown") {
      if (_index != undefined) buttons[_index].addListener("click", _func);
      else buttons.forEach((b) => b.addListener("click", _func));
    } else
      throw Error(
        "Button group can only handle 'onchange' or 'mousedown' events"
      );
  }

  this.setFocus = function (_focus) {
    if (canBeFocused) {
      isFocused = _focus;

      if (_focus) groupContainer.style.border = "1px solid " + focusColor;
      else groupContainer.style.borderColor = "transparent";
    }
  }
}


//_posX, _posY, _sizeX, _sizeY

function inputBox(_params) {
  let self = this;
  //Wrapper Vars
  let posX = _params.posX || 0;
  let posY = _params.posY || 0;
  let sX = _params.sizeX || 20;
  let sY = _params.sizeY || 20;
  
  let zIndex = _params.zIndex || 0;
  let datasetAction = _params.datasetAction;
  let id = _params.id;

  /* INITIALIZATION */
  const inputElement = document.createElement('input'); 
  inputElement.value = 'default';
  //Positioning
  inputElement.style.position = "absolute";
  inputElement.style.left = `${posX}px`; //Pos X
  inputElement.style.top = `${posY}px`; //Pos Y
  inputElement.style.width = `${sX}px`; //Width
  inputElement.style.height = `${sY}px`; //Height

  //Styling
  inputElement.style.border = "1px solid black"; //MAKE VAR
  //inputContainer.style.borderWidth = '1px'; //MAKE VAR
  inputElement.style.fontSize = "10px";
  inputElement.style.textAlign = "center";
  //inputElement.style.background = 'rgb(150, 240, 0)';
  
  inputElement.style.zIndex = zIndex;
  if(datasetAction) inputElement.dataset.action = datasetAction;
  if(id) inputElement.id = id;
  
  if (!_params.parent) document.body.appendChild(inputElement);


  /*
  inputContainer.addEventListener("change", () => {
    console.log(inputElement.value);
  });
  */
  

  this.isFileInput = function(){
    inputElement.setAttribute('type', 'file');
  }
  
  this.getVal = function (_isNum) {
    let val = inputElement.value;
    if (_isNum) val = parseFloat(val);
    return val;
  }

  this.setVal = function (_val) {
    if (typeof _val === "number") inputElement.value = _val.toString();
    else inputElement.value = _val;
  }

  //Set the position of the input box
  this.setPos = function (_x, _y) {
    posX = _x;
    posY = _y;
    inputElement.style.left = `${posX}px`;
    inputElement.style.top = `${posY}px`;
  }

  this.remove = function () {
    inputElement.innerHTML = "";
    inputElement.remove();
  }

  this.show = function (_show) {
    if (_show) inputElement.style.display = "block";
    else inputElement.style.display = "none";
  }

  //Add Listener
  this.addListener = function (_type, _callback) {
    if (typeof _callback === "function")
      inputElement.addEventListener(_type, _callback);
    else throw Error("Argument must be a function");
  }
}


function dropDown(_params) {
    let posX = _params.posX || 0;
    let posY = _params.posY || 0;

    let dropList = _params.parent ? _params.parent.getNewContainer(this, "select")
    : document.createElement("select");

    dropList.style.position = "absolute";
    dropList.style.left = `${posX}px`;
    dropList.style.top = `${posY}px`;

    if(_params.datasetAction) dropList.dataset.action = _params.datasetAction;
    if(_params.id) dropList.id = _params.id;

    if (!_params.parent) document.body.appendChild(dropList);

    this.setPos = function (_x, _y) {
        posX = _x;
        posY = _y;
        dropList.style.left = `${posX}px`;
        dropList.style.top = `${posY}px`;
    }

    this.centerWidth = function () {
        posX -= dropList.offsetWidth / 2;
        dropList.style.left = `${posX}px`;
    }

    this.show = function (_show) {
        if (_show) dropList.style.display = "block";
        else dropList.style.display = "none";
    }



    let listeners = [];

    this.addListener = function (_func) {
        listeners.push(_func);
    }

    let onSelect = function () {
      for (let i = 0; i < listeners.length; i++) {
          listeners[i](dropList.value);
      }    
    }

    dropList.addEventListener("input", onSelect);


    this.addOption = function (_name) {
        let opt = document.createElement("option");
        opt.text = _name;
        dropList.add(opt);
    }

    this.reset = function () {
        dropList.length = 0;
    }

    this.getVal = function(){
        return dropList.value;
    }
    
    this.setVal = function(_val){
      dropList.value = _val;
    }
}
