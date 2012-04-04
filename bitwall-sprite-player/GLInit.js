	
	bitWall = new BitWall();
	
  var globalSpriteAnimationSpeed = 400;
  
	canvas_w = window.innerWidth;
	canvas_h = window.innerHeight;
	aspect = canvas_w/canvas_h;	
	document.write("<canvas id='cubicvr-canvas' style='border: none;' width='"+window.innerWidth+"' height='"+(window.innerHeight)+"'></canvas>");

  //////////////////////////////////////////////////////////////////////////////

	var scene_test;
	var light_obj;
	var canvas_w,canvas_h,aspect;
	
	var gl;
  function initGL( canvas ){
    try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewport(0, 0, canvas.width, canvas.height);
    }catch(e){}
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
    }
		CubicVR.GLCore.init(gl,"js/CubicVR/CubicVR_Core.vs","js/CubicVR/CubicVR_Core.fs");
  };
  
	var light_test,
	    bitWalls = []
	;
	
	
	function webGLStart(){
    var canvas = document.getElementById('cubicvr-canvas');
    initGL( canvas );
		
    scene_test = new CubicVR.Scene();

		scene_test.camera.setDimensions(canvas_w,canvas_h);
    scene_test.camera.setTargeted(true);
    light_test = new CubicVR.Light(CubicVR.enums.light.type.POINT);
   
    light_test.position = [6,10,6];
		light_test.distance = 100;
		light_test.intensity = 2.0;
		light_test.diffuse = [0.5,0.5,0.5];
		light_test.specular = [0.5,0.5,0.5];
		
		scene_test.bindLight(light_test);
		
		CubicVR.setGlobalAmbient([0,0,0]);

    gl.clearColor(0.0, 0.0, 1.0, 1.0);

    gl.clearDepth(1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
	
		canvas.addEventListener('mousemove', mouseMove, false);
		canvas.addEventListener('mousedown', mouseDown, false);
		canvas.addEventListener('mouseup', mouseUp, false);
		canvas.addEventListener('mousewheel', mouseWheel, false);
		canvas.addEventListener('DOMMouseScroll', mouseWheel, false);
	 
    setInterval(drawScene, 15); 
  }

	var timerMilliseconds;
	var timerSeconds = 0;
	var timerLastSeconds = 0;
	var frameCounter = 0;

	function runTimer(){
		if (!timerMilliseconds){
		 	timerMilliseconds = (new Date()).getTime();
			return;
		}
		frameCounter++;
		var newTimerMilliseconds = (new Date()).getTime();
		timerLastSeconds = (newTimerMilliseconds-timerMilliseconds)/1000.0;
		if (timerLastSeconds > (1/10)) timerLastSeconds = (1/10);
		timerSeconds += timerLastSeconds;
		timerMilliseconds = newTimerMilliseconds;	
	};

	var camPos = [5,0,5];
	var camTarget = [0,0,0];
	var camDist = 6;
	var animInterval = 1.0/8.0;
	var animTimer = 0.0;
	var animFrame = 0;

  function drawScene(){
		runTimer();
		light_test.position = scene_test.camera.position;
		gl.clearColor(0, 0, 0, .1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		camPos = CubicVR.vec3.trackTarget(camPos,camTarget,0.05,camDist);
		scene_test.camera.position = camPos;
		scene_test.camera.target = camTarget;
    scene_test.render();
  }			


	var mpos = [0, 0];
	var mdown = false;
	
	function mouseDown(ev){
		mdown = true;
		mpos = [ev.clientX,ev.clientY];
	}
	
	function mouseUp(ev){
		mdown = false;
	}			

	function mouseMove(ev){
		if (!mdown){ return; }
		var mdelta = new Array();
		mdelta[0] = mpos[0]-ev.clientX;
		mdelta[1] = mpos[1]-ev.clientY;
		mpos = [ev.clientX,ev.clientY];
		camPos = CubicVR.vec3.moveViewRelative(camPos,camTarget,camDist*mdelta[0]/300.0,0);
		camPos[1] -= camDist*mdelta[1]/300.0;
		camPos = CubicVR.vec3.trackTarget(camPos,camTarget,1.0,camDist);				
	}
	
	function mouseWheel(ev){
		var delta = ev.wheelDelta?ev.wheelDelta:(-ev.detail*10.0);
		camDist -= delta/100.0;
		if (camDist < 0.3){ camDist = 0.3; }
		if (camDist > 2000.0){ camDist = 2000.0; }
	}


  function run(){
   /*
    bitWall.addSprites([
      'sprites/kraddy2.sprite'
    ]);
    
    console.log( bitWall );

    var kraddy = bitWall.kraddy2; // (Path and file-extensions characters are removed from the sprite URI to form the sprite-name)
    kraddy.action = 'jump';
    */
  };
  
  document.addEventListener('DOMContentLoaded', function(){
    webGLStart();
  }, false);

