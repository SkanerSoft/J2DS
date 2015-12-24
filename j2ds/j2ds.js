var j2ds = (function () {
'use strict';




/*------------------ 2D движок --------------------*/
var j2ds = {
 vector : {},
 math : {},
 dom : {},
 now : Date.now,
 dt : 0,
 stopAll : 0,
 frameLimit : 60,
 sceneStartTime : 0,
 sceneSkipTime : 0,
 engine : false,
 ready : false,
 window : window,
 canDeactivate : true,

 getInfo : false, // Определена
 getDeviceManager : false, // Определена

 getFPSManager : function() {
  j2ds.fpsManager.enabled = true;
  return j2ds.fpsManager;
 },

 getSceneManager : function () {
  return j2ds.scene;
 },

 getLayerManager : function () {
  return j2ds.layers;
 },

 getTextureManager : function() {
  return j2ds.scene.texture;
 },

 getAudioManager : function() {
  j2ds.audio.init();
  return j2ds.audio;
 },

 getPaintManager : function() {
  return j2ds.paint;
 },

 getIO : function() {
  j2ds.input.init();
  j2ds.input.enabled = true;
  return j2ds.input;
 },

 getTouchIO : function() {
  j2ds.touch.init();
  j2ds.touch.enabled = true;
  return j2ds.touch;
 },

 getDOMManager : function() {
  return j2ds.dom;
 },

 getTriggerManager : function () {
  j2ds.trigger.init();
  return j2ds.trigger;
 },

 getMathManager : function() {
  return j2ds.math;
 },

 getGameStateManager : function() {
  return j2ds.gameStates;
 },

 getViewManager : function() {
  return j2ds.viewManager;
 },
};


j2ds.getInfo = function() {
	return {
	 'name' : 'j2Ds',
	 'version' : '0.5.0',
	 'site' : 'https://github.com/SkanerSoft/J2ds',
	 'info' : 'j2Ds - HTML5 2D Game Engine',
	 'author' : 'Skaner'
	};
};




/*----------- DOM ---------------*/
j2ds.dom.id = function (_id) {
 return document.getElementById(_id);
};

j2ds.dom.name = function (_id) {
 return document.getElementsByName(_id)[0];
};

j2ds.dom.tag = function (_id) {
 return document.getElementsByTagName(_id);
};

j2ds.dom.goURL = function (_url) {
	document.location.href = _url;
};

j2ds.dom.reloadURL = function () {
	document.location.href = document.location.href;
};

j2ds.dom.attach = function (_id) {
 j2ds.on('dom:loaded', function () {
  j2ds.dom.tag('body')[0].appendChild(_id);
 });
};


/*------------------- Менеджеp Видов --------------*/
j2ds.viewManager = {
 views : {},

 add : function (_id, _pos) {
  var o = {
   focusNode : false
  };

  o.pos = _pos ? j2ds.math.v2f(_pos.x, _pos.y) : j2ds.math.v2f(0, 0);

  o.setPosition = function (_pos) {
   if (!_pos) return this;
   this.pos = j2ds.math.v2f(_pos.x-j2ds.scene.width/2, _pos.y-j2ds.scene.height/2);
  };

  o.getPosition = function () {
   return this.pos;
  };

  o.move = function (_pos) {
   this.pos.x+= _pos.x;
   this.pos.y+= _pos.y;
  };


  j2ds.viewManager.views[_id] = o;
  return o;
 },

 get : function (_id) {
  return j2ds.viewManager.views[_id];
 },

};





/*------------------- Игровые состояния --------------*/

j2ds.gameStates = {
 states : {},

 add : function (_name, _state) {
  j2ds.gameStates.states[_name] = _state;
 },

};





/*------------------- Математика --------------*/
j2ds.math.v2f = function (_x, _y) {
 return {x: _x, y: _y};
};

j2ds.math.v2i = function (_x, _y) {
 return { x: (_x >> 0), y: (_y >> 0) };
};

j2ds.math.toInt = function (_number) {
	return _number >> 0;
};

j2ds.math.rndColor = function (_min, _max, _alpha) {
 return 'rgba('+j2ds.math.random(_min, _max)+', '+j2ds.math.random(_min, _max)+', '+j2ds.math.random(_min, _max)+', '+_alpha+')';
};

j2ds.math.random = function (_min, _max, _omitZero) {
 var rnd = (Math.floor(Math.random() * (_max - _min + 1) + _min));
 return (_omitZero && rnd == 0) ? j2ds.math.random(_min, _max, _omitZero) : rnd;
};

j2ds.math.rad = function (_num) {
 return _num * (Math.PI / 180);
};








/*-------------------j2Ds--------------------*/

j2ds.setWindow = function (_window) {
	j2ds.window = _window ? _window : window;
};

j2ds.getDeviceManager = function() {
	var o = {};
	o.width = (parseInt(document.documentElement.clientWidth) < parseInt(screen.width))   ? parseInt(document.documentElement.clientWidth):parseInt(screen.width);
	o.height = (parseInt(document.documentElement.clientHeight) < parseInt(screen.height)) ? parseInt(document.documentElement.clientHeight) : parseInt(screen.height);
	return o;
};

j2ds.start = function(_engine, _frameLimit) {
 j2ds.setActiveEngine(_engine);
 j2ds.frameLimit = _frameLimit || 60;
 j2ds.sceneSkipTime = 1000.0 / j2ds.frameLimit;
 j2ds.lastTime = Date.now();
 j2ds.dt = 0;
 j2ds.sceneStartTime = j2ds.lastTime;
 j2ds.gameEngine();
};

j2ds.setActiveEngine = function(_engine) {
	j2ds.engine = (typeof _engine == 'function' ? _engine : console.log('Error in "GameStateManager"'));
};

j2ds.gameEngine = function() {
 j2ds.now = Date.now();
 setTimeout(function () {
  if (!j2ds.stopAll) {
   j2ds.input.upd();
   j2ds.touch.upd();

   j2ds.dt = (j2ds.now - j2ds.lastTime) / 100.0;

   if (j2ds.dt > j2ds.sceneSkipTime/2) {
    j2ds.dt = 0;
   }

   j2ds.sceneStartTime = j2ds.now;

   if (j2ds.scene.autoClear) {
    j2ds.scene.clear();
   }

   j2ds.engine();

   if (j2ds.scene.autoDraw) {
    j2ds.scene.drawAllNodes();
   }

   j2ds.lastTime = j2ds.now;
   j2ds.input.reset();
   j2ds.touch.reset();
   j2ds.fpsManager.upd();
   nextJ2dsGameStep(j2ds.gameEngine);
  }
 }, (j2ds.frameLimit < 60 ? j2ds.sceneSkipTime : 0));
};

var nextJ2dsGameStep = (function() {
 return window.requestAnimationFrame ||
 window.webkitRequestAnimationFrame  ||
 window.mozRequestAnimationFrame     ||
 window.oRequestAnimationFrame       ||
 window.msRequestAnimationFrame      ||
 function (callback) {
  window.setTimeout(callback, 1000 / j2ds.frameLimit);
 };
})();

j2ds.stopEngine = function () {
 if (!j2ds.canDeactivate) return;
 j2ds.stopAll = 1;
 if (j2ds.audio.enabled) {
  j2ds.audio.deactivate();
 }
};

j2ds.runEngine = function () {
 if (!j2ds.canDeactivate) return;
 j2ds.stopAll = 0;
 if (j2ds.audio.enabled) {
  j2ds.audio.activate();
 }
};








/*----------------- Триггеры -------------------*/

j2ds.trigger = {
 enabled : false,
 triggers : {}
};

j2ds.trigger.add = function (_id, _func) {
 var o = {
  command : _func,
  count : 0,
  state : 'stop',
  last : false
 };

 o.run = function (_mSec) {
  if (this.state == 'job') {
   this.command();
   return;
  }
  if (j2ds.now - this.last > _mSec) {
   if (this.last) {
    this.state = 'job';
    this.count+= 1;
    this.command();
   }
   this.last = j2ds.now;
  }
 };

 o.job = function (_mSec) {
  if (j2ds.now - this.last > _mSec && this.state != 'run') {
   if (this.last) {
    this.state = 'run';
    this.count+= 1;
    this.command();
   }
   this.last = j2ds.now;
  }
 };

 o.loop = function (_mSec) {
  if (j2ds.now - this.last > _mSec) {
   if (this.last) {
    this.state = 'run';
    this.count+= 1;
    this.command();
   }
   this.last = j2ds.now;
  }
 };

 o.reset = function () {
  this.count = 0;
  this.state = 'stop';
  this.last = false;
 };

 j2ds.trigger.triggers[_id] = o;
 return o;
};

j2ds.trigger.get = function (_id) {
 return j2ds.trigger.triggers[_id];
};

j2ds.trigger.init = function () {
 j2ds.trigger.enabled = true;
};







/*----------------- audio -------------------*/

j2ds.audio = {
 audios : {},
 enabled : false
};

j2ds.audio.init = function () {
 j2ds.audio.enabled = true;
};

j2ds.audio.load = function (_id, _files, _vol) {
 var audio = document.createElement('audio'),
     source = false;
 for (var i = 0, len = _files.length; i<len; i+=1) {
  var source = document.createElement('source');
  source.src = _files[i];
  audio.appendChild(source);
 }

 audio.id = 'audio_'+_id;

 if (_vol) {
  audio.volume = (_vol <= 1 && _vol >= 0) ? _vol : 1;
 }

 j2ds.dom.attach(audio);

 var o = {
  id : _id,
  files : _files,
  domEl : audio, // DOMElement
  ready : false,
  len : 0,
  state : 'stop',
  lock : false,
  volume : audio.volume,
  ready : false,
  onePlay : false
 };

 o.domEl.onloadeddata = function () {
  o.ready = true;
 };

 o.domEl.onerror = function () {
  o.setLock(true);
 };

 o.domEl.onended = function () {
  o.state = 'stop';
 };

 o.play = function (_unlock) {
  if (_unlock) {
   this.setLock(false);
  }
  if (this.lock) return;
  if (this.state == 'play') {
   this.domEl.currentTime = 0;
  }
  this.domEl.play();
  this.state = 'play';
 };

 o.loop = function () {
  if (this.lock) return;
  this.domEl.play();
  this.state = 'play';
 };

 o.pause = function (_lock) {
  if (this.state == 'play') {
   this.setLock(_lock);
   this.domEl.pause();
   this.state = 'pause';
  }
 };

 o.stop = function (_lock) {
  this.domEl.pause();
  this.domEl.currentTime = 0;
  this.state = 'stop';
  if (_lock) {
   this.setLock(_lock);
  }
 };

 o.setLock = function (_lock) {
  this.lock = _lock ? true : false;
 };

 o.setVolume = function (_vol) {
  this.domEl.volume = (_vol <= 1 && _vol >= 0) ? _vol : 1;
  this.volume = this.domEl.volume;
 };

 o.getVolume = function (_id) {
  return this.volume;
 };

 o.getState = function (_id) {
  return this.state;
 };

 o.getPlayPosition = function () {
  return this.domEl.currentTime;
 };

 j2ds.audio.audios[_id] = o;
 return o;
};

j2ds.audio.get = function (_id) {
 return j2ds.audio.audios[_id];
};

j2ds.audio.pause = function (_lock) {
 for (var snd in j2ds.audio.audios) {
  j2ds.audio.audios[snd].pause(_lock);
 }
};

j2ds.audio.stop = function (_lock) {
 for (var snd in j2ds.audio.audios) {
  j2ds.audio.audios[snd].stop(_lock);
 }
};

j2ds.audio.play = function (_unlock) {
 for (var snd in j2ds.audio.audios) {
  j2ds.audio.audios[snd].play(_unlock);
 }
};

j2ds.audio.deactivate = function () {
 for (var snd in j2ds.audio.audios) {
  if (j2ds.audio.audios[snd].state == 'play') {
   j2ds.audio.audios[snd].pause();
   j2ds.audio.audios[snd].state = 'deactivated';
  }
 }
};

j2ds.audio.activate = function () {
 for (var snd in j2ds.audio.audios) {
  if (j2ds.audio.audios[snd].state == 'deactivated') {
   j2ds.audio.audios[snd].play();
  }
 }
};







/*----------------- Touch -------------------*/
j2ds.touch = {
 enabled : false,
 pos : {x : 0, y : 0},
 screenPos : {x : 0, y : 0},
 canceled : false,
 touchs : [],
 tapDown : false,
 tapPress : false,
 tapUp : false,
 body : false
};

j2ds.touch.getPosition = function () {
 return j2ds.math.v2f(this.pos.x, this.pos.y);
};

j2ds.touch.getScreenPosition = function() {
 return j2ds.math.v2f(this.screenPos.x, this.screenPos.y);
};

j2ds.touch.upd = function () {
 if (!this.enabled) return false;
 var dX = j2ds.scene.offsetWidth / j2ds.scene.width;
 var dY = j2ds.scene.offsetHeight / j2ds.scene.height;

};

j2ds.touch.reset = function () {
 if (!this.enabled) return false;
};

j2ds.touch.cancel = function () {
 if (!this.enabled) return false;
};

j2ds.touch.isTapDown = function () {

};

j2ds.touch.isTapPress = function () {

};

j2ds.touch.isTapUp = function () {

};

j2ds.touch.getTouch = function () {

};

j2ds.touch.onTouchEvent = function () {
 if (!j2ds.touch.enabled) return false;

};



j2ds.touch.init = function() {
 j2ds.on('dom:loaded', function () {

 });
};










/*----------------- INPUT -------------------*/
j2ds.input = {
 /* Переменные */
 pos : {x:0, y:0},
 x : 0,
 y : 0,
 screenPos : {x : 0, y : 0},
 keyDown : [],
 keyPress : [],
 keyPressed : [],
 keyUp : [],
 keyUped : false,
 mouseDown : [],
 mousePress : [],
 mousePressed : [],
 mouseUp : [],
 mouseUpped : false,
 mouseWheel : 0,
 canceled : false,
 body : false,
 anyKey : false,
 anyMouse : false,
 writeMode : false,
 displayCursor : '',
 visible : true,
 enabled : false
};

// Константы клавиш

j2ds.input.mKey = {
 'LEFT' : 1,
 'MIDDLE' : 2,
 'RIGHT' : 3
};

j2ds.input.jKey = {
 'LEFT'      : 37,
 'RIGHT'     : 39,
 'UP'        : 38,
 'DOWN'      : 40,
 'SPACE'     : 32,
 'CTRL'      : 17,
 'SHIFT'     : 16,
 'ALT'       : 18,
 'ESC'       : 27,
 'ENTER'     : 13,
 'MINUS'     : 189,
 'PLUS'      : 187,
 'CAPS_LOCK' : 20,
 'BACKSPACE' : 8,
 'TAB'       : 9,
 'Q'         : 81,
 'W'         : 87,
 'E'         : 69,
 'R'         : 82,
 'T'         : 84,
 'Y'         : 89,
 'U'         : 85,
 'I'         : 73,
 'O'         : 79,
 'P'         : 80,
 'A'         : 65,
 'S'         : 83,
 'D'         : 68,
 'F'         : 70,
 'G'         : 71,
 'H'         : 72,
 'J'         : 74,
 'K'         : 75,
 'L'         : 76,
 'Z'         : 90,
 'X'         : 88,
 'V'         : 86,
 'B'         : 66,
 'N'         : 78,
 'M'         : 77,
 '0'         : 48,
 '1'         : 49,
 '2'         : 50,
 '3'         : 51,
 '4'         : 52,
 '5'         : 53,
 '6'         : 54,
 '7'         : 55,
 '8'         : 56,
 'C'         : 67,
 '9'         : 57,
 'NUM_0'     : 45,
 'NUM_1'     : 35,
 'NUM_2'     : 40,
 'NUM_3'     : 34,
 'NUM_4'     : 37,
 'NUM_5'     : 12,
 'NUM_6'     : 39,
 'NUM_7'     : 36,
 'NUM_8'     : 38,
 'NUM_9'     : 33,
 'NUM_MINUS' : 109,
 'NUM_PLUS'  : 107,
 'NUM_LOCK'  : 144,
 'F1'        : 112,
 'F2'        : 113,
 'F3'        : 114,
 'F4'        : 115,
 'F5'        : 116,
 'F6'        : 117,
 'F7'        : 118,
 'F8'        : 119,
 'F9'        : 120,
 'F10'       : 121,
 'F11'       : 122,
 'F12'       : 123
};

j2ds.input.keyList = function () {
 var o = [];
	for (var i in this.jKey) {
  o.push(i);
	}
	return o;
};

j2ds.input.reset = function () {
 if (!this.enabled) return false;
 this.keyPress = [];
 this.keyUp = [];
 this.mousePress = [];
 this.mouseUp = [];
 this.mouseWheel = 0;
};

j2ds.input.isKeyDown = function(_code) {
 return this.keyDown[this.jKey[_code]];
};

j2ds.input.isKeyPress = function(_code) {
 return this.keyPress[this.jKey[_code]];
};

j2ds.input.isKeyUp = function(_code) {
 return this.keyUp[this.jKey[_code]];
};

j2ds.input.getPosition = function() {
 return j2ds.math.v2f(this.pos.x, this.pos.y);
};

j2ds.input.getScreenPosition = function() {
 return j2ds.math.v2f(this.screenPos.x, this.screenPos.y);
};

j2ds.input.setWriteMode = function (_true) {
 this.writeMode = _true;
};

j2ds.input.isWriteMode = function () {
 return this.writeMode;
};

j2ds.input.keyEvent = function(e) {
 if (!j2ds.input.enabled) return false;
 if (e.type == 'keydown') {
  if (!j2ds.input.keyPressed[e.keyCode]) {
   j2ds.input.keyPress[e.keyCode] = true;
   j2ds.input.keyPressed[e.keyCode] = true;
  }
  if (!j2ds.input.writeMode) {
   e.preventDefault();
  } else {
  	j2ds.onEvent('writeMode:keyPress', '');
  }
 } else if (e.type == 'keyup') {
  if (j2ds.input.keyPressed[e.keyCode]) {
   j2ds.input.keyPress[e.keyCode] = false;
   j2ds.input.keyPressed[e.keyCode] = false;
   j2ds.input.keyUp[e.keyCode] = true;
   j2ds.input.keyUped = true;
   e.preventDefault();
  }
 } else if (e.type == 'keypress' && (j2ds.input.writeMode)) {
  var _char = '';
  if (e.which != 0 && e.charCode != 0) {
   if (e.which >= 32) {
    _char = String.fromCharCode(e.which);
   }
  }
  j2ds.onEvent('writeMode:keyPress', _char);
 }

 j2ds.input.keyDown[e.keyCode] = (e.type== 'keydown')&&(!j2ds.input.canceled);
 j2ds.input.anyKey = e.keyCode;
 return false;
};

j2ds.input.cancel = function(_id) {
 if (!_id) {
  this.canceled = true;
  this.keyDown = [];
  this.mouseDown = [];
 }
 else {
  this.keyDown[j2ds.input.jKey[_id]] = false;
 }
};

j2ds.input.onNode = function(_id) {
 if (!_id.layer.visible) return false;
 return (this.pos.x > _id.pos.x && this.pos.x < _id.pos.x+_id.size.x) &&
        (this.pos.y > _id.pos.y && this.pos.y < _id.pos.y+_id.size.y);
};

j2ds.input.upd = function() {
 if (!this.enabled) return false;
 var dX = j2ds.scene.offsetWidth / j2ds.scene.width;
 var dY = j2ds.scene.offsetHeight / j2ds.scene.height;
 this.x = (this.screenPos.x/dX);
 this.y = (this.screenPos.y/dY);
 this.pos.x = j2ds.scene.view.pos.x + this.x;
 this.pos.y = j2ds.scene.view.pos.y + this.y;
};

j2ds.input.onMove = function(e) {
 this.screenPos.x = -j2ds.scene.offsetLeft+e.pageX;
 this.screenPos.y = -j2ds.scene.offsetTop+e.pageY;
};

j2ds.input.isMouseDown = function(_code) {
 return this.mouseDown[this.mKey[_code]];
};

j2ds.input.isMousePress = function(_code) {
 return this.mousePress[this.mKey[_code]];
};

j2ds.input.isMouseUp = function(_code) {
 return this.mouseUp[this.mKey[_code]];
};

j2ds.input.isMouseWheel = function(_code) {
 return (_code == 'UP' && this.mouseWheel > 0) ||
        (_code == 'DOWN' && this.mouseWheel < 0)
};

j2ds.input.onMouseWheel = function (e) {
 if (!j2ds.input.enabled) return false;
	this.mouseWheel = ((e.wheelDelta) ? e.wheelDelta : -e.detail);
	e.preventDefault();
	return false;
};

j2ds.input.onMouseEvent = function(e) {
 if (!j2ds.input.enabled) return false;
 if (!e.which && e.button) {
  if (e.button & 1) e.which = 1;
  else if (e.button & 4) e.which = 2;
       else if (e.button & 2) e.which = 3;
 }

 if (e.type == 'mousedown') {
  if (!j2ds.input.mousePressed[e.which]) {
   j2ds.input.mousePress[e.which] = true;
   j2ds.input.mousePressed[e.which] = true;
  }
 } else if (e.type == 'mouseup') {
  if (j2ds.input.mousePressed[e.which]) {
   j2ds.input.mousePress[e.which] = false;
   j2ds.input.mousePressed[e.which] = false;
   j2ds.input.mouseUp[e.which] = true;
   j2ds.input.mouseUped = true;
  }
 }

 j2ds.input.mouseDown[e.which] = (e.type == 'mousedown') && (!j2ds.input.canceled);

 j2ds.window.focus();
 e.preventDefault();
 return false;
};

j2ds.input.setCursorImage = function (_curImg) {
	j2ds.dom.tag('body')[0].style.cursor = 'url("'+_curImg+'"), auto';
};

j2ds.input.setVisible = function (_true) {
 j2ds.input.visible = _true;
 if (!_true) {
  j2ds.input.displayCursor = j2ds.dom.tag('body')[0].style.cursor;
  j2ds.dom.tag('body')[0].style.cursor = 'none';
 } else {
  j2ds.dom.tag('body')[0].style.cursor = j2ds.input.displayCursor;
 }
};

j2ds.input.isVisible = function () {
	return j2ds.input.visible;
};

j2ds.input.init = function() {
 j2ds.on('dom:loaded', function () {
  j2ds.window.oncontextmenu = function() { return false; };
  j2ds.window.onselectstart = j2ds.window.oncontextmenu;
  j2ds.window.ondragstart = j2ds.window.oncontextmenu;
  j2ds.window.onmousedown = j2ds.input.onMouseEvent;
  j2ds.window.onmouseup = function(e) { j2ds.input.canceled = false; j2ds.input.onMouseEvent(e); };
  j2ds.window.onmousemove = function(e) { j2ds.input.onMove(e); };
  j2ds.window.onkeydown = function(e) { j2ds.input.keyEvent(e); };
  j2ds.window.onkeyup = function(e) { j2ds.input.canceled = false; j2ds.input.keyEvent(e); };
  j2ds.window.onkeypress = function(e) { j2ds.input.keyEvent(e); };
  j2ds.window.onmousewheel = function(e) { j2ds.input.onMouseWheel(e); };

  if (j2ds.window.addEventListener) {
   j2ds.window.addEventListener("DOMMouseScroll", function(e) {
   	j2ds.input.onMouseWheel(e);
   }, false);
  }
 });
};







/*--------------- События ----------------*/
j2ds.events = {
 'scene:deactivate' : [],
 'scene:activate' : [],

 'scene:beforeInit' : [],
 'scene:afterInit' : [],
 'scene:beforeStart' : [],
 'scene:afterStart' : [],

 'scene:changedGameState' : [],

 'writeMode:keyPress' : [],

 'dom:loaded' : []
};


j2ds.on = function (_event, _func) {
	j2ds.events[_event].push(_func);
 if (j2ds.ready && _event == 'dom:loaded') {
  j2ds.onEvent('dom:loaded');
  return true;
 }
};

j2ds.onEvent = function (_eventType, _args) {
 for (var i = 0, len = j2ds.events[_eventType].length; i < len; i+=1) {
  if (j2ds.events[_eventType]) {
   j2ds.events[_eventType][i](_args || '');
  }
 }
};





/*---------------- слои -------------------*/

j2ds.layers = {};
j2ds.layers.list = {};

j2ds.layers.layer = function (_id) {
	return j2ds.layers.list[_id];
};

j2ds.layers.add = function (_id, _index, _notDOM) {

 if (j2ds.layers.list[_id]) {
  return false;
 }

	var o = {};
	o.layerName = _id;

	if (!_notDOM) {
	 o.canvas = document.createElement('canvas');
	} else {
	 o.canvas = j2ds.dom.id(_id);
	}

 o.canvas.style.position = j2ds.scene.stylePosition;

 o.canvas.id = _id;

 o.canvas.style.zIndex = 1000+_index;
 o.canvas.style.left = j2ds.scene.offsetLeft+'px';
 o.canvas.style.top = j2ds.scene.offsetTop+'px';

	o.canvas.width = j2ds.scene.width;
	o.canvas.height = j2ds.scene.height;
	o.width = j2ds.scene.width;
	o.height = j2ds.scene.height;
	o.context = o.canvas.getContext('2d');
	o.context.shadowColor = 'rgba(0,0,0,0)';
 o.alpha = 1;
 o.angle = 0;
 o.visible = 1;

 o.onContext = function (_func) {
 	_func(this.context);
 };

 o.fill = function (_color) {
 	this.context.fillStyle = _color;
 	this.context.fillRect(0, 0, this.width, this.height);
 };

 o.setAlpha = function (_alpha) {
  this.canvas.style.opacity = _alpha;
  this.alpha = _alpha;
 };

 o.getAlpha = function () {
  return this.alpha;
 };

 o.setVisible = function (_visible) {
 	if (_visible) {
 	 this.canvas.style.display = 'block';
 	 this.visible = true;
  } else {
  	this.canvas.style.display = 'none';
  	this.visible = false;
  }
 };

 o.isVisible = function () {
 	return this.visible;
 };

 o.setIndex = function (_index) {
 	this.canvas.style.zIndex = 1000+_index;
 };

 o.clear = function () {
 	this.context.clearRect(0, 0, this.width, this.height);
 };

 o.clearNode = function (_node) {
 	if (_node.isLookScene()) {
   this.context.clearRect(_node.pos.x-j2ds.scene.view.pos.x, _node.pos.y-j2ds.scene.view.pos.y, _node.size.x, _node.size.y);
 	}
 };

 o.clearRect = function (_pos, _size) {
  this.context.clearRect(_pos.x-j2ds.scene.view.pos.x, _pos.y-j2ds.scene.view.pos.y, _size.x, _size.y);
 };

	j2ds.layers.list[_id] = o;

	if (!_notDOM) {
	 j2ds.dom.attach(j2ds.layers.list[_id].canvas);
	}

 return o;
};



/*----------------- сцена ---------------------*/

j2ds.scene = {
 nodes : [],
 layerName : 'sceneNode',
 stylePosition : 'fixed',
 layers : j2ds.layers,
 autoDraw : false,
 autoClear : false,
 view : false,
 gameStateName : false,
 canFullScreen : true
};


/*функции*/

j2ds.scene.setView = function (_id) {
 j2ds.scene.view = j2ds.viewManager.views[_id];
};

j2ds.scene.getView = function () {
 return j2ds.scene.view;
};

j2ds.scene.setAutoDraw = function (_true) {
 j2ds.scene.autoDraw = _true;
};

j2ds.scene.setAutoClear = function (_true) {
 j2ds.scene.autoClear = _true;
};

j2ds.scene.setGameState = function(_name) {
 if (j2ds.gameStates.states[_name]) {
  j2ds.setActiveEngine(j2ds.gameStates.states[_name]);
 }
 j2ds.scene.gameStateName = _name;
 j2ds.onEvent('scene:changedGameState');
};

j2ds.scene.getGameState = function() {
 return j2ds.scene.gameStateName;
};

j2ds.scene.start = function (_name, _frameLimit) {
 j2ds.onEvent('scene:beforeStart');
 if (j2ds.gameStates.states[_name]) {
  j2ds.start(j2ds.gameStates.states[_name], _frameLimit);
 }
 j2ds.onEvent('scene:afterStart');
};

j2ds.scene.fullScreen = function(_true) {
 if (!j2ds.scene.canFullScreen) return;
 var layer;
 var tmpCanvas = document.createElement('canvas'); // Нужны для копирования содержимого
 var tmpContext = tmpCanvas.getContext('2d');      // При изменении размера
 if (_true) {
  j2ds.scene.origWidth = j2ds.scene.width;
  j2ds.scene.origHeight = j2ds.scene.height;
  j2ds.scene.width = j2ds.getDeviceManager().width;
  j2ds.scene.height = j2ds.getDeviceManager().height;
  for (var i in j2ds.layers.list)
  {
   layer = j2ds.layers.list[i];
   tmpCanvas.width = layer.width;
   tmpCanvas.height = layer.height;
   tmpContext.drawImage(layer.canvas, 0, 0);
   layer.canvas.width = j2ds.scene.width;
   layer.canvas.height = j2ds.scene.height;
   layer.width = j2ds.scene.width;
   layer.height = j2ds.scene.height;
   j2ds.scene.offsetWidth = j2ds.scene.width;
   j2ds.scene.offsetHeight = j2ds.scene.height;

   layer.context.drawImage(tmpCanvas, 0, 0, layer.width, layer.height);
  }
 } else {
  j2ds.scene.width = j2ds.scene.origWidth;
  j2ds.scene.height = j2ds.scene.origHeight;
  for (var i in j2ds.layers.list)
  {
   layer = j2ds.layers.list[i];
   layer.width = j2ds.scene.origWidth;
   layer.height = j2ds.scene.origHeight;
   layer.canvas.width = j2ds.scene.origWidth;
   layer.canvas.height = j2ds.scene.origHeight;
   j2ds.scene.offsetWidth = j2ds.scene.origWidth;
   j2ds.scene.offsetHeight = j2ds.scene.origHeight;

  }
 }
};

j2ds.scene.fullScale = function(_true) {
 if (!j2ds.scene.canFullScreen) return;
 var layer;
 if (_true) {
  for (var i in j2ds.layers.list)
  {
   layer = j2ds.layers.list[i].canvas;
   layer.style.width = j2ds.getDeviceManager().width+'px';
   layer.style.height = j2ds.getDeviceManager().height+'px';
   j2ds.scene.offsetWidth = j2ds.getDeviceManager().width;
   j2ds.scene.offsetHeight = j2ds.getDeviceManager().height;
  }
 } else {
  for (var i in j2ds.layers.list)
  {
   layer = j2ds.layers.list[i].canvas;
   layer.style.width = j2ds.scene.width+'px';
   layer.style.height = j2ds.scene.height+'px';
   j2ds.scene.offsetWidth = j2ds.scene.width;
   j2ds.scene.offsetHeight = j2ds.scene.height;
  }
 }
};

j2ds.scene.clear = function() {
 j2ds.scene.getLayer().clear();
};

j2ds.scene.getLayer = function () {
	return j2ds.layers.layer(j2ds.scene.layerName);
};

j2ds.scene.init = function(_w, _h, _canDeactivate) {

 j2ds.onEvent('scene:beforeInit');

	j2ds.scene.width = _w;
	j2ds.scene.height = _h;

	j2ds.scene.origWidth = _w;
	j2ds.scene.origHeight = _h;

 j2ds.scene.offsetWidth = _w;
 j2ds.scene.offsetHeight = _h;

 j2ds.scene.offsetLeft = 0;
 j2ds.scene.offsetTop = 0;


 j2ds.canDeactivate = _canDeactivate == false ? false : true;

 j2ds.layers.add('sceneNode', 0);

 j2ds.scene.context = j2ds.layers.layer(j2ds.scene.layerName).context;
 j2ds.scene.canvas = j2ds.layers.layer(j2ds.scene.layerName).canvas;
 j2ds.scene.visible = true;

 j2ds.scene.cancelClear = false;

 /* Вид "камеры" */
 j2ds.scene.view = j2ds.viewManager.add('sceneView');

 j2ds.onEvent('scene:afterInit');

 j2ds.window.onload = function () {

  j2ds.window.focus();

  j2ds.window.onblur = function () {
   if (j2ds.stopAll == 0) {
    j2ds.stopEngine();
    j2ds.onEvent('scene:deactivate');
   }
  };

  j2ds.window.onfocus = function () {
   if (j2ds.stopAll == 1) {
    j2ds.runEngine();
    nextJ2dsGameStep(j2ds.gameEngine);
    j2ds.onEvent('scene:activate');
    j2ds.input.cancel();
   }
  };

 	for (var i in j2ds.layers.list) {
   j2ds.dom.attach(j2ds.layers.layer(i).canvas);
  }

  j2ds.ready = true;

  j2ds.onEvent('dom:loaded');
 };
};

j2ds.scene.initCanvas = function(_id, _canDeactivate) {

 j2ds.scene.canFullScreen = false;

 j2ds.scene.layerName = _id;

 j2ds.onEvent('scene:beforeInit');

	j2ds.scene.width = parseInt(j2ds.dom.id(_id).width);
	j2ds.scene.height = parseInt(j2ds.dom.id(_id).height);

	j2ds.scene.origWidth = j2ds.scene.width;
	j2ds.scene.origHeight = j2ds.scene.height;

 j2ds.scene.offsetWidth = parseInt(j2ds.dom.id(_id).offsetWidth);
 j2ds.scene.offsetHeight = parseInt(j2ds.dom.id(_id).offsetHeight);

 j2ds.scene.offsetLeft = parseInt(j2ds.dom.id(_id).offsetLeft);
 j2ds.scene.offsetTop = parseInt(j2ds.dom.id(_id).offsetTop);

 j2ds.scene.stylePosition = j2ds.dom.id(_id).style.position == 'fixed'?'fixed':'absolute';

 j2ds.canDeactivate = _canDeactivate == false ? false : true;

 j2ds.layers.add(_id, 0, 1);

 j2ds.scene.context = j2ds.layers.layer(_id).context;
 j2ds.scene.canvas = j2ds.layers.layer(_id).canvas;
 j2ds.scene.visible = true;

 j2ds.scene.cancelClear = false;

 /* Вид "камеры" */
 j2ds.scene.view = j2ds.viewManager.add('sceneView');

 j2ds.onEvent('scene:afterInit');

 j2ds.window.onload = function () {

  j2ds.window.focus();

  j2ds.window.onblur = function () {
   if (j2ds.stopAll == 0) {
    j2ds.stopEngine();
    j2ds.onEvent('scene:deactivate');
   }
  };

  j2ds.window.onfocus = function () {
   if (j2ds.stopAll == 1) {
    j2ds.runEngine();
    nextJ2dsGameStep(j2ds.gameEngine);
    j2ds.onEvent('scene:activate');
    j2ds.input.cancel();
   }
  };

 	for (var i in j2ds.layers.list) {
   j2ds.dom.attach(j2ds.layers.layer(i).canvas);
  }

  j2ds.ready = true;

  j2ds.onEvent('dom:loaded');
 };
};


/*--------------- Объекты ----------------*/
j2ds.Obj= {
 inherit : function (_parent, _child) {
  _child.prototype = Object.create(_parent.prototype);
  _child.prototype.constructor = _child;
 }
};


j2ds.scene.drawAllNodes = function () {
 for (var i = 0, len = j2ds.scene.nodes.length; i < len; i+= 1) {
  if (j2ds.scene.nodes[i].draw) {
   j2ds.scene.nodes[i].draw();
  }
 }
};

/*------------------ базовый объект -------------------*/

j2ds.scene.addBaseNode= function (_pos, _size) {
	return new j2ds.scene.BaseNode(_pos, _size);
};

j2ds.scene.BaseNode = function(_pos, _size) {
  this.visible  = true;
  this.alpha    = 1;
  this.pos      = _pos;
  this.size     = _size;
  this.parent   = false;
  this.angle    = 0;
  this.layer    = j2ds.scene;
 	this.box      = {
	                  offset : {x : 0, y : 0},
	                  size : {x : 0, y : 0}
	                 };
  j2ds.scene.nodes.push(this);
};

j2ds.scene.BaseNode.prototype.resizeBox = function (_offset, _size) {
	this.box.offset = _offset;
	this.box.size = _size;
};

j2ds.scene.BaseNode.prototype.setLayer = function (_layer) {
	this.layer = _layer ? j2ds.layers.layer(_layer) : j2ds.scene;
};

j2ds.scene.BaseNode.prototype.getLayer = function () {
	return this.layer;
};

j2ds.scene.BaseNode.prototype.setVisible = function(_visible) {
 this.visible = _visible;
};

j2ds.scene.BaseNode.prototype.isVisible = function() {
 return this.visible;
};

j2ds.scene.BaseNode.prototype.setAlpha = function(_alpha) {
 if (_alpha < 0) _alpha = 0;
 if (_alpha > 1) _alpha = 1;
 this.alpha = _alpha;
};

j2ds.scene.BaseNode.prototype.getAlpha = function(_alpha) {
 return this.alpha;
};

j2ds.scene.BaseNode.prototype.moveTo = function(_to, _t) {
 _t = _t?_t:1;
 this.move(j2ds.math.v2f(
 ((_to.x - this.getPosition().x) / _t),
 ((_to.y - this.getPosition().y) / _t)
 ));
};

j2ds.scene.BaseNode.prototype.setPosition = function(_pos) {
 if (_pos) {
  this.pos = j2ds.math.v2f(_pos.x-Math.ceil(this.size.x/2), _pos.y-Math.ceil(this.size.y/2) );
 } else {
  return this.pos;
 }
};

j2ds.scene.BaseNode.prototype.move = function(_pos) {
  this.pos.x+= _pos.x;
  this.pos.y+= _pos.y;
};

j2ds.scene.BaseNode.prototype.getPosition = function() {
 return j2ds.math.v2f(this.pos.x+Math.ceil(this.size.x/2), this.pos.y+Math.ceil(this.size.y/2));
};

j2ds.scene.BaseNode.prototype.setSize = function(_size) {
 if (_size) {
  this.size = _size;
 } else {
 	return this.size;
 }
};

j2ds.scene.BaseNode.prototype.getSize = function() {
 return this.size;
};

j2ds.scene.BaseNode.prototype.setParent = function(_id) {
	this.parent = _id;
};

j2ds.scene.BaseNode.prototype.getDistance = function(_id) {
	return Math.ceil( Math.sqrt(
	  Math.pow(_id.getPosition().x - this.getPosition().x, 2)+
	  Math.pow(_id.getPosition().y - this.getPosition().y, 2)
	                  )
	       );
};

j2ds.scene.BaseNode.prototype.getDistanceXY = function(_id) {
	return j2ds.math.v2f(Math.abs(_id.getPosition().x-this.getPosition().x), Math.abs(_id.getPosition().y-this.getPosition().y));
};

j2ds.scene.BaseNode.prototype.isIntersect = function(_id) {
 var pos = {
  x1 : this.pos.x+this.box.offset.x,
  x2 : _id.pos.x+_id.box.offset.x,
  y1 : this.pos.y+this.box.offset.y,
  y2 : _id.pos.y+_id.box.offset.y
 };

 var size = {
  x1 : this.size.x+this.box.size.x,
  x2 : _id.size.x+_id.box.size.x,
  y1 : this.size.y+this.box.size.y,
  y2 : _id.size.y+_id.box.size.y
 };

return (
        (pos.y1+size.y1 >= pos.y2) &&
        (pos.x1+size.x1 >= pos.x2)
       ) && (
        (pos.x1 < pos.x2+size.x2) &&
        (pos.y1 < pos.y2+size.y2)
       );
};

j2ds.scene.BaseNode.prototype.isCollision = function(_id) {
var result = false;
 if (
 (this.getDistanceXY(_id).x < (this.size.x/2 + _id.size.x/2)) &&
 (this.getDistanceXY(_id).y < (this.size.y/2 + _id.size.y/2))
 ) {
    result = true;
   }
 return result;
};

j2ds.scene.BaseNode.prototype.isLookScene = function() {
	var yes = true;
	if ((this.pos.x > j2ds.scene.view.pos.x+j2ds.scene.width ||
	     this.pos.x+this.size.x < j2ds.scene.view.pos.x) ||
	  (this.pos.y > j2ds.scene.view.pos.y+j2ds.scene.height ||
	   this.pos.y+this.size.y < j2ds.scene.view.pos.y)) {
	    yes = false;
	   }
	return yes;
};

j2ds.scene.BaseNode.prototype.turn = function(_angle) {
	this.angle = (this.angle % 360);
	this.angle+= _angle;
};

j2ds.scene.BaseNode.prototype.setRotation = function(_angle) {
	this.angle = _angle % 360;
};

j2ds.scene.BaseNode.prototype.getRotation = function(_angle) {
	return this.angle;
};

j2ds.scene.BaseNode.prototype.isOutScene = function() {
	var o = {};

	if (this.pos.x+this.size.x >= j2ds.scene.view.pos.x+j2ds.scene.width) o.x = 1;
	else	if (this.pos.x <= j2ds.scene.view.pos.x) {o.x = -1; }
	     else { o.x = 0; }

	if (this.pos.y+this.size.y >= j2ds.scene.view.pos.y+j2ds.scene.height) o.y = 1;
	else	if (this.pos.y <= j2ds.scene.view.pos.y) { o.y = -1; }
	     else { o.y = 0; }

	o.all = (o.x || o.y);

	return o;
};

j2ds.scene.BaseNode.prototype.moveDir = function(_speed) {
 this.pos.x+= _speed*(Math.cos(j2ds.math.rad(this.angle)));
 this.pos.y+= _speed*(Math.sin(j2ds.math.rad(this.angle)));
};

j2ds.scene.BaseNode.prototype.drawBox = function() {
 var context = this.layer.context;
 context.lineWidth = 2;
 context.strokeStyle = 'black';

 context.beginPath();
 context.rect(
 this.pos.x-j2ds.scene.view.pos.x,
 this.pos.y-j2ds.scene.view.pos.y,
 this.size.x, this.size.y);
 context.stroke();

 context.strokeStyle = 'yellow';

 context.beginPath();
 context.rect(this.box.offset.x+this.pos.x-j2ds.scene.view.pos.x, this.box.offset.y+this.pos.y-j2ds.scene.view.pos.y,
              this.box.size.x+this.size.x, this.box.size.y+this.size.y);
 context.stroke();
};







/*------------------ текст --------------------*/


j2ds.scene.addTextNode = function (_pos, _text, _sizePx, _color, _family, _width, _colorL) {
	return new j2ds.scene.TextNode(_pos, _text, _sizePx, _color, _family, _width, _colorL);
};

j2ds.scene.TextNode = function(_pos, _text, _sizePx, _color, _family, _width, _colorL) {

 j2ds.scene.BaseNode.call(this, _pos, j2ds.math.v2f(0, 0));

 /*Свойства*/

 this.vAlign = 'top';
 this.hAlign = 'left';
 this.color = _color ? _color : 'black';

 this.family = _family ? _family : 'serif';
 this.sizePx = _sizePx ? _sizePx : 20;

 this.box.offset.y = j2ds.math.toInt(this.sizePx*0.26);
 this.box.size.y = -j2ds.math.toInt(this.sizePx*0.26);

 this.lineWidth = _width ? _width : 0;
 this.colorL = _colorL ? _colorL : 'black';

 this.font = this.sizePx+'px '+ this.family;

 this.fullText = _text;
 this.maxWidth = 0;
 this.lines = _text.split("\n");

 j2ds.scene.context.font = this.font;

 for (var i = 0, len = this.lines.length; i < len; i += 1) {
  this.maxWidth = (this.maxWidth < j2ds.scene.context.measureText(this.lines[i]).width ?
                                   j2ds.scene.context.measureText(this.lines[i]).width :
                                   this.maxWidth);
 }

 this.size.x = this.maxWidth;
 this.size.y = this.lines.length * this.sizePx;
};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.TextNode);

j2ds.scene.TextNode.prototype.setSize = function (_sizePx) {
 this.sizePx = _sizePx;
 this.font = this.sizePx+'px '+ this.family;
 j2ds.scene.context.font = this.font;

 this.box.offset.y = j2ds.math.toInt(this.sizePx*0.26);
 this.box.size.y = -j2ds.math.toInt(this.sizePx*0.26);

 for (var i = 0, len = this.lines.length; i < len; i += 1) {
  this.maxWidth = (this.maxWidth < j2ds.scene.context.measureText(this.lines[i]).width ?
                                   j2ds.scene.context.measureText(this.lines[i]).width :
                                   this.maxWidth);
 }
 this.size.x = this.maxWidth;
 this.size.y = this.lines.length * this.sizePx;
};

j2ds.scene.TextNode.prototype.getSize = function () {
	return this.sizePx;
};

j2ds.scene.TextNode.prototype.drawSimpleText = function (_text, _pos, _color, _colorL) {
 var context = this.layer.context;
 context.fillStyle = _color ? _color : this.color;
 context.textAlign = this.hAlign;
 context.textBaseline = this.vAlign;
 context.font = this.font;
 context.lineWidth = this.lineWidth;
 context.strokeStyle = _colorL ? _colorL : this.colorL;

 var lines = _text.split("\n");

 var pos = _pos ? _pos : this.pos;

 for (var i = 0, len = lines.length; i < len; i += 1) {
   if (this.lineWidth) {
    context.strokeText(lines[i], pos.x, pos.y+this.sizePx*i);
   }
  context.fillText(lines[i], pos.x, pos.y+this.sizePx*i);
 }
 context.lineWidth = 0;
 context.strokeStyle = 'black';
};

j2ds.scene.TextNode.prototype.getText = function () {
	return this.fullText;
};

j2ds.scene.TextNode.prototype.setText = function (_text) {
 this.fullText = _text;
 this.maxWidth = 0;
 this.lines = _text.split("\n");

 j2ds.scene.context.font = this.font;

 this.box.offset.y = j2ds.math.toInt(this.sizePx*0.26);
 this.box.size.y = -j2ds.math.toInt(this.sizePx*0.26);

 for (var i = 0, len = this.lines.length; i < len; i += 1) {
  this.maxWidth = (this.maxWidth < j2ds.scene.context.measureText(this.lines[i]).width ?
                                   j2ds.scene.context.measureText(this.lines[i]).width :
                                   this.maxWidth);
 }
 this.size.x = this.maxWidth;
 this.size.y = this.lines.length * this.sizePx;
};

j2ds.scene.TextNode.prototype.draw = function() {
 var context = this.layer.context;
 if (this.visible && this.isLookScene()) {
  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }

  if (this.angle)
  {
   context.save();
   context.translate(this.getPosition().x-j2ds.scene.view.pos.x, this.getPosition().y-j2ds.scene.view.pos.y);
   context.rotate(j2ds.math.rad(this.angle));
   context.translate(-(this.getPosition().x-j2ds.scene.view.pos.x), -(this.getPosition().y-j2ds.scene.view.pos.y));
  }

  context.fillStyle = this.color;
  context.textAlign = this.hAlign;
  context.textBaseline = this.vAlign;
  context.font = this.font;
  context.lineWidth = this.lineWidth;
  context.strokeStyle = this.colorL;

  for (var i = 0, len = this.lines.length; i < len; i += 1) {
   if (this.lineWidth) {
    context.strokeText(this.lines[i], this.pos.x-j2ds.scene.view.pos.x, this.pos.y+this.sizePx*i-j2ds.scene.view.pos.y);
   }
   context.fillText(this.lines[i], this.pos.x-j2ds.scene.view.pos.x, this.pos.y+this.sizePx*i-j2ds.scene.view.pos.y);
  }

  context.lineWidth = 0;
  context.strokeStyle = 'black';

  if (this.angle) { context.restore(); }

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};









/*------------------ окружность --------------------*/

j2ds.scene.addCircleNode = function (_pos, _radius, _color) {
	return new j2ds.scene.CircleNode(_pos, _radius, _color);
};

j2ds.scene.CircleNode = function(_pos, _radius, _color) {

 j2ds.scene.BaseNode.call(this, _pos, j2ds.math.v2f(_radius*2, _radius*2));

 /*Свойства*/
 this.color = _color;
 this.radius = _radius;
};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.CircleNode);

j2ds.scene.CircleNode.prototype.draw = function() {
 var context = this.layer.context;
 if (this.visible && this.isLookScene()) {
  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }
  context.lineWidth = 0;
  context.fillStyle = this.color;

  context.beginPath();
  context.arc(this.pos.x-j2ds.scene.view.pos.x+this.radius,
  this.pos.y-j2ds.scene.view.pos.y+this.radius,
  this.radius, 0, 2*Math.PI,true);
  context.stroke();
  context.fill();

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};









/*-------------------- линии ----------------------*/

j2ds.scene.addLineNode = function (_pos, _points, _scale, _color, _width, _fill, _cFill) {
	return new j2ds.scene.LineNode(_pos, _points, _scale, _color, _width, _fill, _cFill);
};

j2ds.scene.LineNode = function(_pos, _points, _scale, _color, _width, _fill, _cFill) {

 j2ds.scene.BaseNode.call(this, _pos, j2ds.math.v2f(0,0))

 /*Свойства*/
 this.color = _color;
 this.points = _points;
 this.fill = _fill || false;
 this.scale = _scale || 0;
 this.cFill = _cFill;
 this.lineWidth = _width;
};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.LineNode);

j2ds.scene.LineNode.prototype.draw = function() {
 var context = this.layer.context;
 if (this.visible && this.isLookScene()) {

  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }

  context.strokeStyle = this.color;
  context.lineWidth = this.lineWidth;

  context.beginPath();
  context.moveTo(this.pos.x-j2ds.scene.view.pos.x,
  this.pos.y-j2ds.scene.view.pos.y);

  for (var i=0, len = this.points.length;i<len;i+=1) {
   context.lineTo(
   this.pos.x+this.points[i][0]*this.scale-j2ds.scene.view.pos.x,
   this.pos.y+this.points[i][1]*this.scale-j2ds.scene.view.pos.y);
  }

  context.stroke();
  if (this.fill) {
   context.fillStyle = this.cFill;
   context.fill();
  }

  context.lineWidth = 0;

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};









/*--------------------- прямоугольники ------------------------*/

j2ds.scene.addRectNode = function (_pos, _size, _color) {
	return new j2ds.scene.RectNode(_pos, _size, _color);
};

j2ds.scene.RectNode = function(_pos, _size, _color) {

 j2ds.scene.BaseNode.call(this, _pos, _size)

 this.color = _color;
};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.RectNode);

j2ds.scene.RectNode.prototype.draw = function() {
 var context = this.layer.context;
 if (this.visible  && this.isLookScene()) {

  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }

  if (this.angle)
  {
   context.save();
   context.translate(this.getPosition().x-j2ds.scene.view.pos.x, this.getPosition().y-j2ds.scene.view.pos.y);
   context.rotate(j2ds.math.rad(this.angle));
   context.translate(-(this.getPosition().x-j2ds.scene.view.pos.x), -(this.getPosition().y-j2ds.scene.view.pos.y));
  }

  context.fillStyle = this.color;
  context.lineWidth = 0;

  context.fillRect(
  this.pos.x-j2ds.scene.view.pos.x,
  this.pos.y-j2ds.scene.view.pos.y,
  this.size.x, this.size.y);

  if (this.angle) { context.restore(); }

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};









/*--------------------- изображения ---------------------*/

j2ds.scene.texture = {
 loadImageMap    : false,   // загрузка из файла
 createImageMap : false,    // создание анимации напрямую, минуя imageMap
 templates : {}
};

j2ds.scene.texture.createImageMap = function(_w, _h, _func) {
 var o = {
  img : null,
  width : _w,
  height : _h
 };

 o.img = document.createElement('canvas');
 o.context = o.img.getContext('2d');
 o.img.width = o.width;
 o.img.height = o.height;

 _func(o.context);

 /* Функции */
 o.getAnimation = function(_sourceX, _sourceY, _sourceW, _sourceH, _frameCount) {
  var o = {
   imageMap : this,
   sourceX : _sourceX,
   sourceY : _sourceY,
   sourceW : _sourceW,
   sourceH : _sourceH,
   frameCount : _frameCount-1
  };
  return o;
 };

 return o;
};

j2ds.scene.texture.loadImageMap = function(path) {
 var o = {
  img : null,
  width : 0,
  height : 0,
  loaded : false
 };

 o.img = document.createElement('img');
 o.crossOrigin = 'anonymous';
 o.img.src = path;
 o.img.onload = function() {
  o.width = o.img.width;
  o.height = o.img.height;
  o.loaded = true;
 };
 /* Свойства */

 /* Функции */
 o.getAnimation = function(_sourceX, _sourceY, _sourceW, _sourceH, _frameCount) {
  var o = {
   imageMap : this,
   sourceX : _sourceX,
   sourceY : _sourceY,
   sourceW : _sourceW,
   sourceH : _sourceH,
   frameCount : _frameCount-1
  };
  return o;
 };

 return o;
};


j2ds.scene.addSpriteNode = function (_pos, _size, _animation) {
	return new j2ds.scene.SpriteNode(_pos, _size, _animation);
};

j2ds.scene.SpriteNode = function(_pos, _size, _animation) {

 j2ds.scene.BaseNode.call(this, _pos, _size);

 this.tmpSpeed = 0;
 this.frame = 0;
 this.animation = _animation;
 this.flip = {x:false, y:false};

};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.SpriteNode);

j2ds.scene.SpriteNode.prototype.setFlip = function(_x, _y) {
 this.flip = {x:_x, y:_y};
};

j2ds.scene.SpriteNode.prototype.draw = function(_speed) {
 if (this.visible && this.isLookScene()) {
  _speed = _speed || 1;

  if (this.frame > this.animation.frameCount) {
   this.frame = 0;
  }
  this.drawFrame(this.frame+1);

  if (this.tmpSpeed > _speed) {
   this.frame+=1;
   this.tmpSpeed = 0;
  }
  else {
   this.tmpSpeed+=1;
  }
 };
};

 // отрисовка одного кадра
j2ds.scene.SpriteNode.prototype.drawFrame = function(_frame) {
 var context = this.layer.context;
 if (this.visible && this.isLookScene()) {

  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }

  context.lineWidth = 0;

  if (this.angle || this.flip.x || this.flip.y)
  {
   context.save();
   context.translate(this.getPosition().x-j2ds.scene.view.pos.x, this.getPosition().y-j2ds.scene.view.pos.y);
   context.rotate(j2ds.math.rad(this.angle));
   context.scale(this.flip.x ? -1 : 1, this.flip.y ? -1 : 1);
   context.translate(-(this.getPosition().x-j2ds.scene.view.pos.x), -(this.getPosition().y-j2ds.scene.view.pos.y));
  }

  _frame = _frame?(_frame-1):0;

  context.drawImage(
  this.animation.imageMap.img,
  (this.animation.sourceX+(this.animation.sourceW*_frame)), this.animation.sourceY,
  this.animation.sourceW, this.animation.sourceH,
  this.pos.x-j2ds.scene.view.pos.x, this.pos.y-j2ds.scene.view.pos.y,
  this.size.x, this.size.y);

  if (this.angle || this.flip.x || this.flip.y) {context.restore(); }

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};

j2ds.scene.SpriteNode.prototype.setAnimation = function(_id) {
 if (this.animation != _id)	{
	 this.animation = _id;
	}
};



/*----------- шаблоны текстур -------------*/

j2ds.scene.texture.templates.ellips = function (_context, _size, _color) {

};

j2ds.scene.texture.templates.fillRect = function (_context, _size, _color) {
 _context.fillStyle = _color;
 _context.fillRect(0, 0, _size.x, _size.y);
};

j2ds.scene.texture.templates.strokeRect = function (_context, _size, _color, _lineWidth) {
 _context.strokeStyle = _color;
 _context.lineWidth = _lineWidth;
 _context.strokeRect(0, 0, _size.x, _size.y);
};

j2ds.scene.texture.templates.gradientL = function (_context, _size, _colors, _izHorizontal) {
 var gradient = _context.createLinearGradient(0, 0, _size.x, 0);
 var step = 1 / _colors.length;
 if (!_izHorizontal) {
  gradient = _context.createLinearGradient(0, 0, 0, _size.y);
 }
 for (var i = step/2, j = 0; j < _colors.length; j+=1, i+=step) {
  gradient.addColorStop(i, _colors[j]);
 }
 _context.fillStyle = gradient;
 _context.fillRect(0, 0, _size.x, _size.y);
};

j2ds.scene.texture.templates.gradientR = function (_context, _size, _pos1, _r1, _pos2, _r2, _colors) {
	var gradient = _context.createRadialGradient(_pos1.x, _pos1.y, _r1, _pos2.x, _pos2.y, _r2);
	var step = 1 / _colors.length;
 for (var i = step/2, j = 0; j < _colors.length; j+=1, i+=step) {
  gradient.addColorStop(i, _colors[j]);
 }
 _context.fillStyle = gradient;
 _context.fillRect(0, 0, _size.x, _size.y);
};












/*--------------- Локальное хранилище ----------------*/



j2ds.createLocal = function(_id) {
var o = {};
o.id = _id;
o.ls = j2ds.window.localStorage ? j2ds.window.localStorage : false;

if (!o.ls) alert('j2Ds ERROR in "createLocal('+_id+')" \n' + 'Объект "localStorage" не поддерживается.');
/*Свойства*/

/*Функции*/
o.saveNode = function (_name, _o) {
 if (!this.ls) return false;
  this.ls.setItem(this.id+_name, JSON.stringify(_o));
 };

 o.load = function (_name) {
  if (!this.ls) { return false; }
  return this.ls.getItem(this.id+_name);
 };

 o.is = function (_name) {
 if (!this.ls) { return false; }
  return !!(this.ls.getItem(this.id+_name));
 }

 o.save = function (_name, _value) {
  if (!this.ls) { return false; }
  this.ls.setItem(this.id+_name, _value);
 }

 o.loadNode = function (_name) {
 if (!this.ls) { return false; }
  return JSON.parse(this.ls.getItem(this.id+_name));
 }

 return o;
};


/*-------------------FPSManager--------------------*/

j2ds.fpsManager = {
 enabled : false,
 fps : 1,
 tmp_of_fps   : 1,
 tmp_of_time  : Date.now()
};

j2ds.fpsManager.init = function () {
 j2ds.fpsManager.enabled = true;
};

j2ds.fpsManager.upd = function () {
 if (!this.enabled) return;
 this.tmp_of_fps += 1;
 if (j2ds.now - this.tmp_of_time >= 1000) {
  this.fps = this.tmp_of_fps;
  this.tmp_of_fps = 1;
  this.tmp_of_time = j2ds.now;
 }
};

j2ds.fpsManager.getFPS = function () {
	return (this.fps-1);
};

return j2ds;
})();






