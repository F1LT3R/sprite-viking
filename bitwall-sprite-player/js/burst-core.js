  /* Burst-Core
     Copyright F1LT3R @ Bocoup
     License: CC3 */
(function( global, doc ){

  // Array Sort
  //////////////////////////////////////////////////////////////////////////////
  function sortNumber(a,b){ return a - b; }

  // Array Type-Check
  //////////////////////////////////////////////////////////////////////////////
  function isArray( obj ){
    if( obj.constructor.toString().indexOf( 'Array' ) == -1 ){
      return false;
    }else{
      return true;
    }
  };

  // Easing
  //////////////////////////////////////////////////////////////////////////////
  var ease = {
        step          : function(x,t,b,c,d){ if( t==d ){ return d; }else{ return 1; } },
        linear        : function(x,t,b,c,d){ return c*t/d + b; },
        inOutQuad     : function(x,t,b,c,d){ if((t/=d/2) < 1){ return c/2*t*t + b;}else{ return -c/2 * ((--t)*(t-2) - 1) + b; }},
        inQuad        : function(x,t,b,c,d){ return c*(t/=d)*t + b; },
        outQuad       : function(x,t,b,c,d){ return -c *(t/=d)*(t-2) + b; },
        inCubic       : function(x,t,b,c,d){ return c*(t/=d)*t*t + b; },
        outCubic      : function(x,t,b,c,d){ return c*((t=t/d-1)*t*t + 1) + b; },
        inOutCubic    : function(x,t,b,c,d){ if((t/=d/2) < 1){ return c/2*t*t*t + b;}else{ return c/2*((t-=2)*t*t + 2) + b; }},
        inQuart       : function(x,t,b,c,d){ return c*(t/=d)*t*t*t + b; },
        outQuart      : function(x,t,b,c,d){ return -c * ((t=t/d-1)*t*t*t - 1) + b; },
        inOutQuart    : function(x,t,b,c,d){ if ((t/=d/2) < 1) return c/2*t*t*t*t + b; return -c/2 * ((t-=2)*t*t*t - 2) + b; },
        inQuint       : function(x,t,b,c,d){ return c*(t/=d)*t*t*t*t + b; },
        outQuint      : function(x,t,b,c,d){ return c*((t=t/d-1)*t*t*t*t + 1) + b; },
        inOutQuint    : function(x,t,b,c,d){ if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b; return c/2*((t-=2)*t*t*t*t + 2) + b; },
        inSine        : function(x,t,b,c,d){ return -c * Math.cos(t/d * (Math.PI/2)) + c + b; },
        outSine       : function(x,t,b,c,d){ return c * Math.sin(t/d * (Math.PI/2)) + b; },
        inOutSine     : function(x,t,b,c,d){ return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; },
        inExpo        : function(x,t,b,c,d){ return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; },
        outExpo       : function(x,t,b,c,d){ return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; },
        inOutExpo     : function(x,t,b,c,d){ if (t==0) return b; if (t==d) return b+c; if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b; return c/2 * (-Math.pow(2, -10 * --t) + 2) + b; },
        inCirc        : function(x,t,b,c,d){ return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; },
        outCirc       : function(x,t,b,c,d){ return c * Math.sqrt(1 - (t=t/d-1)*t) + b; },
        inOutCirc     : function(x,t,b,c,d){ if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b; return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b; },
        inElastic     : function(x,t,b,c,d){ var s=1.70158; var p=0;var a=c; if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; },
        outElastic    : function(x,t,b,c,d){ var s=1.70158; var p=0;var a=c; if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b; },
        inOutElastic  : function(x,t,b,c,d){ var s=1.70158; var p=0;var a=c; if (t==0) return b; if ((t/=d/2)==2) return b+c; if (!p) p=d*(.3*1.5); if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b; },
        inBack        : function(x,t,b,c,d){ var s = 1.70158; return c*(t/=d)*t*((s+1)*t - s) + b; },
        outBack       : function(x,t,b,c,d){ var s = 1.70158; return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b; },
        inOutBack     : function(x,t,b,c,d){ var s = 1.70158; if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b; return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b; },
        inBounce      : function(x,t,b,c,d){ return c - ease.outBounce( x, d-t, 0, c, d) + b; },
        outBounce     : function(x,t,b,c,d){ if((t/=d) < (1/2.75)){ return c*(7.5625*t*t) + b; } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b; } else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b; } else { return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b; } },
        inOutBounce   : function(x,t,b,c,d){ if(t < d/2){ return ease.inBounce(x, t*2, 0, c, d) * 0.5 + b;}else{ return ease.outBounce(x, t*2-d, 0, c, d) * 0.5 + c*0.5 + b; }}  
      },

      Burst_proto, Timeline_proto, Obj_proto, Track_proto, Key_proto
  ;

  // Burst Instance
  //////////////////////////////////////////////////////////////////////////////
  function Burst(){
    this.timelines={};
    this.loaded={};
    this.fps = 30;
    this.timelineCount = 0;
    this.onframe=undefined;
  };

  Burst_proto = Burst.prototype;

  Burst_proto.timeline = function(name,start,end,speed,loop,callback){
    return this.timelines[name]||(arguments.length>1?this.timelines[name]=new Timeline(name,start,end,speed,loop,callback,this):undefined);
  };

  Burst_proto.load = function( name ){  
    return this.loaded[name] || (function(){
      for(var i in this.timelines ){
        if( this.timelines[i].name === name ){
          return (this.loaded[i] = this.timelines[i]);
        }
      }
    }).call(this);
    return false;
  };

  Burst_proto.unload = function( name ){
    delete this.loaded[name];
    return true;
  };

  Burst_proto.play = function(){
    var deepref = this;
    clearInterval( global.interval );
    global.interval = window.setInterval(function(){
      deepref.frame();
    }, 1000 / this.fps );
  };

  Burst_proto.frame = function( frame ){
    if(this.onframe){this.onframe();}
    for( var i in this.loaded ){
      if(this.hasOwnProperty("loaded")){
        this.loaded[i].play( frame );
      }
    }
  };
  
  Burst_proto.stop = function(){
    window.clearInterval( this.interval );
    delete this.interval;
  };

  // Timeline
  //////////////////////////////////////////////////////////////////////////////
  function Timeline(name,start,end,speed,loop,callback,parent){
    parent.timelineCount++;
    this.name=name;
    this.start=this.frame=start;
    this.end=end;
    this.speed=speed;

    this.loop=loop;
    this.callback=callback;
    this.parent=parent;
    this.objects={};
    return this;
  };

  Timeline_proto = Timeline.prototype;

  Timeline_proto.obj = function(name,objRef){
    return this.objects[name]||(this.objects[name]=new Obj(name,objRef,this));
  };
  
  Timeline_proto.play = function( frame ){
    this.frame = frame || (this.frame += this.speed);
    if( this.loop ){
      if( this.frame > this.end ){ this.frame = this.start; }
      if( this.frame < this.start ){ this.frame = this.end; }
    }else{
      if( this.frame >= this.end){
        this.frame = this.end;
        //this.parent.unload(this.name);
        if(this.callback){this.callback(this.frame);}
      }
      if( this.frame <= this.start ){
        this.frame = this.start;
        //this.parent.unload(this.name);
        if(this.callback){this.callback(this.frame);}
      }
    }
    var thisObj;
    for( var i in this.objects ){
      thisObject = this.objects[i];
      for( var j in thisObject.tracks ){
        thisObject.tracks[j].play( this.frame );
      }
    }
    if( this.always ){ this.always.call(this,this.frame); }
  };  


  // Object / "Actor"
  //////////////////////////////////////////////////////////////////////////////
  function Obj(name,objRef,parent){
    this.name=name;
    this.objRef=objRef;
    this.parent=parent;
    this.tracks={};
    return this;
  };

  Obj_proto = Obj.prototype;
  
  Obj_proto.track = function(prop){
    return this.tracks[prop]||(this.tracks[prop]=new Track(prop,this));
  };

  // Track
  //////////////////////////////////////////////////////////////////////////////
  function Track(prop,parent){
    this.prop=prop;
    this.ease=ease;
    this.parent=parent;
    this.keys=[];
    
    //console.log( this.parent.objRef );
    //this.unit=typeof this.parent.objRef[prop] === 'number' ? undefined : this.parent.objRef[prop].replace(/[.0-9]/g,'');
    this.alwaysCallback;
    return this;
  };

  Track_proto = Track.prototype;
  
  Track_proto.key = function(frame,value,ease,callback){
    for(var i=0,l=this.keys.length;i<l;i++){
      if(this.keys[i].frame === frame){
        return this.keys[i];
      }
    }
    if(arguments.length>1){
      var keyIndex=[], keyStack=[], thisKey = this.keys[this.keys.length] = new Key(frame,value,ease,callback,this);
      for(i=0;i<this.keys.length;i++){
        keyIndex[i]=this.keys[i].frame;
      }
      keyIndex.sort(sortNumber);
      for(i=0;i<this.keys.length;i++){
        for(var j=0;j<this.keys.length;j++){
          if(keyIndex[i]==this.keys[j].frame){
            keyStack[i]=this.keys[j];
          }
        }
      }
      this.keys=[];
      for(i=0, l=keyStack.length; i< l; i++){
        this.keys[i] = keyStack[i];
      }
      return thisKey;
    }else{
      return false;
    }
  };

  Track_proto.play = function(frame){
    var curKey, nextKey, val, indice, aryLen;
    for(var i=0, l=this.keys.length; i<l; i++){
      curKey = this.keys[i];
      nextKey = this.keys[i+1];
      if(nextKey === undefined && i+1 > l-1){
        nextKey = this.keys[l-1];
      }
      if( frame >= curKey.frame && frame < nextKey.frame ){

          if( curKey.isArray ){
            aryLen = curKey.aryLen;
            for(indice=0; indice< aryLen; indice++){
              val = this.ease[ curKey.ease ]( 0,
              frame-curKey.frame,
              curKey.value[ indice ],
              nextKey.value[ indice ]-curKey.value[ indice ],
              nextKey.frame-curKey.frame );
              this.parent.objRef[this.prop][ indice ] = val;
            }
          }else if( curKey.isString ){
            this.parent.objRef[this.prop] = curKey.value;
          }else{ 
            val = this.ease[ curKey.ease ]( 0,
            frame-curKey.frame,
            curKey.value,
            nextKey.value-curKey.value,
            nextKey.frame-curKey.frame );
            this.parent.objRef[this.prop] = val;
          }
          
          if(this.lastKeyFired && this.lastKeyFired.frame != curKey.frame){
            this.lastKeyFired.callbackFired = false;
          }
          
          if(curKey.callback && !curKey.callbackFired){
            curKey.callback.call(this.parent.objRef, {
              frame      : frame,
              prop       : this.prop,
              burstTrack : this
            });
            curKey.callbackFired=true;
            this.lastKeyFired = curKey;
          }

      }else if( frame >= nextKey.frame || frame === 0 ){
        if( curKey.isArray ){
          aryLen = curKey.aryLen;
          for(indice=0; indice< aryLen; indice++){
            this.parent.objRef[this.prop][ indice ] = curKey.value[ indice ];
          }
        }else{
         this.parent.objRef[this.prop][ indice ] = curKey.value;
        }
      }
    }
    if(this.alwaysCallback){
      this.alwaysCallback.call(this.parent.objRef, {
        frame      : frame,
        prop       : this.prop,
        burstTrack : this
      });
    }
  };

  Track_proto.always = function( func ){
    this.alwaysCallback = func;
    return this;
  };

  Track_proto.obj=function(name,objRef){
    var timeline = this.parent.parent;
    return timeline.obj.call(timeline,name,objRef);
  };

  // Key
  //////////////////////////////////////////////////////////////////////////////
  function Key(frame,value,ease,callback,parent){
    this.frame=frame;
    this.value=value; 
    if( isArray( value ) ){
      this.isArray = true;
      this.aryLen = value.length;
    }
    if( typeof value == 'string' ){
      this.isString = true;
    }
    this.ease=ease||'linear';
    this.callback=callback;
    this.callbackFired=false;
    this.parent=parent;
    return this;
  };

  Key_proto = Key.prototype;

  Key_proto.obj=function(name,objRef){
    var timeline = this.parent.parent.parent;
    return timeline.obj.call(timeline,name,objRef);
  };

  Key_proto.track=function(name,objRef,prop){
    var obj = this.parent.parent;
    return obj.track.call(obj,name,objRef,prop);
  };

  Key_proto.key=function(frame,value,ease,callback){
    var track = this.parent;
    return track.key.call(track,frame,value,ease,callback);
  };

  Key_proto.always=function(func){
    var track = this.parent;
    return track.always.call(track,func);
  };

  // Instantiation
  //////////////////////////////////////////////////////////////////////////////
  global.burst = new Burst();

})( window, document );
