
	canvas_w = window.innerWidth;
	canvas_h = window.innerHeight;
	aspect = canvas_w/canvas_h;	
	document.write("<canvas id='cubicvr-canvas' style='border: none;' width='"+window.innerWidth+"' height='"+(window.innerHeight)+"'></canvas>");

  //////////////////////////////////////////////////////////////////////////////

	var scene_test;
	var light_obj;
	var canvas_w,canvas_h,aspect;
	
	var gl;
  function initGL(canvas) {
    try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewport(0, 0, canvas.width, canvas.height);
    } catch(e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
    }

		CubicVR.GLCore.init(gl,"js/CubicVR/CubicVR_Core.vs","js/CubicVR/CubicVR_Core.fs");
  }

	var light_test;

	var bca = null;
	var testObj = null;
	var tex = null;
	var bitmapCanvas = null;

	function webGLStart() 
	{
    var canvas = document.getElementById("cubicvr-canvas");
    initGL(canvas);				
		
    scene_test = new CubicVR.Scene();

    tex = new CubicVR.Texture();
    tex.setFilter(CubicVR.enums.texture.filter.NEAREST);
    tex.use();
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);    
    
     
    bca = new BitmapCubeArray(64,64,tex,0);

    testObj = new CubicVR.SceneObject(bca.mesh);
    
    scene_test.bindSceneObject(testObj);

		scene_test.camera.setDimensions(canvas_w,canvas_h);
    scene_test.camera.setTargeted(true);
    // scene_test.camera.target = scene_test.getSceneObject("Empty").position;
		
    // light_test = new cubicvr_light(CubicVR.enums.light.type.DIRECTIONAL);
    light_test = new CubicVR.Light(CubicVR.enums.light.type.POINT);
    // light_test.setDirection([1,0.4,1]);
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
	
	  bitmapCanvas = document.getElementById('output');
	
    setInterval(drawScene, 15); 
  }
  


	var timerMilliseconds;
	var timerSeconds = 0;
	var timerLastSeconds = 0;
	var frameCounter = 0;

	function runTimer()
	{
		if (!timerMilliseconds)
		{
		 	timerMilliseconds = (new Date()).getTime();
			return;
		}

		frameCounter++;

		var newTimerMilliseconds = (new Date()).getTime();

		timerLastSeconds = (newTimerMilliseconds-timerMilliseconds)/1000.0;

		if (timerLastSeconds > (1/10)) timerLastSeconds = (1/10);
		
		timerSeconds += timerLastSeconds;
		timerMilliseconds = newTimerMilliseconds;	
	}

/*
  var xxx=0, yyy=0, zzz=0;
  document.addEventListener('keypress',function(e){
    console.log(e);
    if(e.charCode="97"){
      xxx=xxx+.1;
    }  
  	camTarget = [xxx,yyy,zzz];
    console.log(1);
  },false);
*/

	var camPos = [5,0,5];
	var camTarget = [0,0,0];
	var camDist = 1.4;
	
	var animInterval = 1.0/8.0;
	var animTimer = 0.0;
	var animFrame = 0;


  function updateBitmapTexture()
  {
    gl.bindTexture(gl.TEXTURE_2D, CubicVR.Textures[tex.tex_id]);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapCanvas);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  function drawScene() 
	{
		runTimer();

//        updateBitmapTexture();

		light_test.position = scene_test.camera.position;

		gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		camPos = CubicVR.vec3.trackTarget(camPos,camTarget,0.05,camDist);

		scene_test.camera.position = camPos;
		scene_test.camera.target = camTarget;
		
    scene_test.render();
  }			


	var mpos = [0,0]
	var mdown = false;
	
	function mouseDown(ev)
	{
		mdown = true;
		mpos = [ev.clientX,ev.clientY];
	}
	
	function mouseUp(ev)
	{
		mdown = false;
	}			

	function mouseMove(ev)
	{
		if (!mdown) return;
		
		var mdelta = new Array();
		
		mdelta[0] = mpos[0]-ev.clientX;
		mdelta[1] = mpos[1]-ev.clientY;
						
		mpos = [ev.clientX,ev.clientY];
						
		camPos = CubicVR.vec3.moveViewRelative(camPos,camTarget,camDist*mdelta[0]/300.0,0);
		camPos[1] -= camDist*mdelta[1]/300.0;

		camPos = CubicVR.vec3.trackTarget(camPos,camTarget,1.0,camDist);				
	}
	
	function mouseWheel(ev)
	{
		var delta = ev.wheelDelta?ev.wheelDelta:(-ev.detail*10.0);

		camDist -= delta/100.0;
		if (camDist < 0.3) camDist = 0.3;
		if (camDist > 2000.0) camDist = 2000.0;
	}


