(function(global){

  // List of sprites to load on start
  var spriteList = [
        'kraddy.sprite'
      ],
      sprite = 'kraddy',
      action = 'walk',
      playing = true,
      ctx,
      drawLoop,
      characterSelect,
      actionSelect,
      mspfMultiplier = 400,
      mspf = 0.5 * mspfMultiplier
      speedInput  = $('#time-ops').find('input[name$=speed]'),
      speedSlider = $('#mspf')
  ;

  viking.sprite = sprite;
  viking.action = action;

  viking.loadSprites(spriteList, {callback: function(){
  }});

  function run(){

    ////////////////////////////////////////////////////////////////////////////
    // MINI SPRITE PREVIEW, SET UP "CHARACTER & ACTION" SELECT-OPTIONS
    ////////////////////////////////////////////////////////////////////////////

    // Mini Sprite Preview //
    ctx = document.getElementById('output').getContext('2d');
    var self = this;
    try{ clearInterval( drawLoop ); }catch( e ){
      console.log( e );
    }
    function drawFrame(){
      if( playing ){
        var nextFrame = viking.sprites[sprite][action].frame();
        ctx.clearRect( 0, 0, 64, 64 );
        ctx.putImageData( nextFrame, 0, 0 );
        updateBitmapTexture();
        var currentFrame = viking.sprites[viking.sprite][viking.action].currentFrame;
        //console.log( currentFrame );
        $('#time-ops .frame').slider({value: currentFrame });
        $('#time-ops input[name$=frame]').val( currentFrame );
        $('#action-frames canvas').removeClass('playingFrame');
        var currentFrameCanvas = $('#action-frames canvas:eq('+currentFrame+')');
        currentFrameCanvas.addClass('playingFrame');
        var scrollLeft = $('#action-timeline')[0].scrollLeft;
        
        if( currentFrameCanvas.position().left+currentFrameCanvas.width() >=  (scrollLeft+$('#action-timeline').width()) || currentFrameCanvas.position().left < scrollLeft  ){
          $('#action-timeline')[0].scrollLeft = currentFrameCanvas.position().left;
        }
      }
    };
    drawLoop = setInterval( function(){ drawFrame(); }, mspf );

    
    // Setup "Character & Action" Options //
    //------------------------------------//

    // Reference DOM Ids for 'character' & 'option' selected boxes
    characterSelect = document.getElementById('character');
    actionSelect = document.getElementById('action');
    
    // Add the sprites to the character select
    function addSpritesToDropDown(){
      for(var i=0, l = spriteList.length; i< l; i++){
        var option = document.createElement('option'),
          spriteName = spriteList[i].split('.')[0];
        option.innerHTML = option.value = spriteName;
        characterSelect.appendChild( option );
      }
    };
    addSpritesToDropDown();

    // Add the actions to the 'actions'-select
    function addActionsToDropDown(){
      actionSelect.innerHTML = '';
      for(var i in viking.sprites[sprite] ){
        firstAction = i;
        break;
      }
      for(var i in viking.sprites[sprite] ){
        var option = document.createElement('option');
        option.innerHTML = option.value = i;
        actionSelect.appendChild( option );
      };
      action = firstAction;
      $('#accordianSelectedAction').text( action );      
      updateActionSpeed( viking.data.sprites[sprite].action[action].speed );
    };
    addActionsToDropDown();
 
    // Update 'actions'-select when character is changed
    characterSelect.addEventListener('change', function(){
      sprite = this.value;
      addActionsToDropDown();

      buildFrameLIs();
      
      /*
      $('#time-ops .frame').slider( frameSlider() );
      viking.sprites[sprite][action].currentFrame = -1;
      $('#time-ops input[name$=frame]').val(0);
      $('#action-timeline canvas').click( actionTimelineCanvasClick );
      $('#action-frames canvas').removeClass('playingFrame');
      $('#action-frames canvas:eq('+0+')').addClass('playingFrame');
      */
      
    }, false );


    // Create the frame-LIs that highlight current-frame of the animation
    function buildFrameLIs(){
      $('#action-frames').html('');
      var l = viking.sprites[sprite][action].frames.length;
      
      for(i=0; i< l; i++ ){
        var data = viking.sprites[sprite][action].frames[i];
        $('#action-frames').append( '<li><canvas id="action-frame-'+i+'" width="64" height="64"></canvas></li>' );
        var ctxx = $('#action-frames canvas:last')[0].getContext('2d');
        ctxx.clearRect(0,0,64,64);
        ctxx.putImageData(data,0,0);
      }
    };
    buildFrameLIs();

    // DELETE FRAME ////////////////////////////////////////////////////////////
    $('#deleteFrame').click(function(){
      var curFrame = parseInt($('#action-frames .playingFrame').attr('id').split('-')[2]);
      $('#action-frames .playingFrame').remove();
      viking.data.sprites[sprite].action[action].rects.remove(curFrame);
      viking.data.sprites[sprite].blit();
      buildFrameLIs();
      $('#time-ops .frame').slider( frameSlider() );
      viking.sprites[sprite][action].currentFrame = -1;
      $('#time-ops input[name$=frame]').val(0);
      $('#action-timeline canvas').click( actionTimelineCanvasClick );
      $('#action-frames canvas').removeClass('playingFrame');
      $('#action-frames canvas:eq('+0+')').addClass('playingFrame');
    });

    // NEW FRAME ///////////////////////////////////////////////////////////////
    $('#newFrame').click(function(){
      var rects       = viking.data.sprites[sprite].action[action].rects,
          frameCount  = rects.length
      ;
      var er = viking.data.sprites[sprite].rect[rects[frameCount-1]];
      viking.data.sprites[sprite].rect[viking.data.sprites[sprite].rect.length] = [ er[0],er[1],er[2],er[3],er[4],er[5] ]; 
      rects[rects.length] = viking.data.sprites[sprite].rect.length-1;
      viking.data.sprites[sprite].blit();
      buildFrameLIs();
      $('#action-timeline canvas').click( actionTimelineCanvasClick );
      $('#time-ops .frame').slider( frameSlider() );
      curFrame=rects.length-1;
      viking.sprites[sprite][action].currentFrame = curFrame;
      $('#time-ops input[name$=frame]').val(curFrame);
      $('#action-timeline canvas').click( actionTimelineCanvasClick );
      $('#action-frames canvas').removeClass('playingFrame');
      $('#action-frames canvas:eq('+curFrame+')').addClass('playingFrame');
    });
    
    
    
    // NEW ACTION //
    $('#newAction').click(function(){
      $('#newActionName').dialog({
        title     : 'New Action Name',
        resizable : false,
        buttons   : {
          'OK': function(){
            var spriteRects         = viking.data.sprites[sprite].rect,
                spriteRectCount     = spriteRects.length,
                actionRects         = viking.data.sprites[sprite].action[action].rects,
                actionRectsLength   = actionRects.length,
                newActionName       = $('#newActionNameInput').val()
            ;
      
            var r = spriteRects[spriteRectCount-1];
            spriteRects[spriteRectCount] = [0,0,10,10,0,0];//(function(){ return [ r[0], r[1], r[2], r[3], r[4], r[5] ]; })();
            var newActionObj = viking.data.sprites[sprite].action[newActionName] = { speed: 0.5 };
            newActionObj.rects = [spriteRects.length-1];

            action = newActionName;
            $('#action').val(newActionName);
            
            viking.data.sprites[sprite].blit();
            addActionsToDropDown();
            buildFrameLIs();

                        
            $(this).dialog('close');
          },
          'Cancel': function(){
            $(this).dialog('close');
          }
        }
      });
    });
        
  
    // DELETE ACTION //
    $('#deleteAction').click(function(){
      //oldActionRects = (function(){ return viking.data.sprites[sprite].action[action].rects })();
      delete viking.data.sprites[sprite].action[action];
      //cleanRects( oldActionRects );
      viking.data.sprites[sprite].blit();
      addActionsToDropDown();
      viking.action = $('#action').val();
      $('#action-frames').html('');
      $('#accordianSelectedAction').text( action );
      for(i=0, l=viking.sprites[sprite][action].frames.length; i< l; i++ ){
        var data = viking.sprites[sprite][action].frames[i];
        $('#action-frames').append( '<li><canvas id="action-frame-'+i+'" width="64" height="64"></canvas></li>' );
        var ctx = $('#action-frames canvas:last')[0].getContext('2d');
        ctx.clearRect(0,0,64,64);
        ctx.putImageData(data,0,0);
      }
      $('#action-timeline>div').css({ width: (i*54)+'px' });
      $('#time-ops .frame').slider( frameSlider() );
      viking.sprites[sprite][action].currentFrame = -1;
      $('#time-ops input[name$=frame]').val(0);
      $('#action-timeline canvas').click( actionTimelineCanvasClick );
      if(!playing){
        playing = true;
        drawFrame();
        playing = false;
      }else{
        drawFrame();
      }
      updateActionSpeed( viking.data.sprites[sprite].action[action].speed );
      
    });

    // TIME-OPS ////////////////////////////////////////////////////////////////
    
    
    function updateActionSpeed( newSpeed ){
      viking.data.sprites[sprite ].action[action].speed = newSpeed;
      speedInput.val( newSpeed );
      speedSlider.slider({ value: newSpeed * 1000 });
      clearInterval( drawLoop );
      drawLoop = setInterval( function(){ drawFrame(); }, mspf = (newSpeed) * mspfMultiplier );      
    };

    // Animation Speed Slider (per action)
		speedSlider.slider({
		   min    : 0,
		   max    : 1000,
		   value  : 0.5,
       slide  : function( event, ui ){
                  updateActionSpeed( ui.value /1000 );
                }
    });
        
    speedInput.change(function(e){
      updateActionSpeed( constrain( parseFloat(speedInput.val()), 0, 1 ) );     
    });
    
    // Update the speed input with the action speed
    updateActionSpeed( viking.data.sprites[sprite].action[action].speed );
    

    // Re-order & blit the sprite action data (rects) when LI Canvas frames are sorted
    $('#action-frames').sortable({
      stop: function(event, ui){
        var newRectOrder = [];
        $(this).children('li').children('canvas').each(function(i){
          newRectOrder[ i ] = ~~$(this).attr('id').split('-')[2];
        });
        var newActionRects = [];
        for(var i=0, l=newRectOrder.length; i< l; i++){
          newActionRects[i] = viking.data.sprites[sprite].action[action].rects[ newRectOrder[i] ];
        }
        viking.data.sprites[sprite].action[action].rects = newActionRects;
        viking.data.sprites[sprite].blit();
      }
    });

    // Update UI when action-dropdown is changed
    actionSelect.addEventListener('change', function(){
      action = viking.action = this.value;
      $('#action-frames').html('');
      $('#accordianSelectedAction').text( action );
      for( var i=0, l=viking.sprites[sprite][action].frames.length; i< l; i++ ){
        var data = viking.sprites[sprite][action].frames[i];
        $('#action-frames').append( '<li><canvas id="action-frame-'+i+'" width="64" height="64"></canvas></li>' );
        var ctx = $('#action-frames canvas:last')[0].getContext('2d');
        ctx.clearRect(0,0,64,64);
        ctx.putImageData(data,0,0);
      }
      $('#action-timeline>div').css({ width: (i*54)+'px' });
      $('#time-ops .frame').slider( frameSlider() );
      viking.sprites[sprite][action].currentFrame = -1;
      $('#time-ops input[name$=frame]').val(0);
      $('#action-timeline canvas').click( actionTimelineCanvasClick );
      if(!playing){
        playing = true;
        drawFrame();
        playing = false;
      }else{
        drawFrame();
      }
      updateActionSpeed( viking.data.sprites[sprite].action[action].speed );
    }, false);

    // Change the frame when clicking on it's canvas in the #action-timeline
    actionTimelineCanvasClick = function(e){
      var index = ~~$(this).attr('id').split('-')[2]-2;
      if( index < 0 ){ index = viking.sprites[sprite][action].frames.length - -index };
      viking.sprites[sprite][action].currentFrame = index;
      var nextFrame = viking.sprites[sprite][action].frame();
      ctx.clearRect( 0, 0, 64, 64 );
      ctx.putImageData( nextFrame, 0, 0 );
      updateBitmapTexture();
      $('#action-frames canvas').removeClass('playingFrame');
      $('#action-frames canvas:eq('+index+')').addClass('playingFrame');
      playing = true;
      drawFrame();
      playing = false;
    };
    
    $('#action-timeline canvas').click( actionTimelineCanvasClick );
    
    // EDIT RECT/FRAME /////////////////////////////////////////////////////////
    $('#editFrame').click(function(){
      //$(this).toggleClass('rect-selected');
      var i = parseInt($('#action-frames .playingFrame').attr('id').split('-')[2]);
      selectedRectNumber = viking.data.sprites[sprite].action[action].rects[i];
      
      viking.selectedRectNumber = selectedRectNumber;

      $('#rect-editor iframe').remove();

      var link = this;

      $('#rect-editor')[0].prevCoords = [];

      $('#rect-editor').dialog({
        title     : 'Frame Editor',
        width     : 756,
        resizable : false,
        open      : function(){
          var prevCoords = [
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][0],
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][1],
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][2],
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][3],
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][4],
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][5]                                                
          ];
          $('#rect-editor')[0].prevCoords = prevCoords;
        },
        buttons   : {
          'Done': function(){
            var coords = $('#rect-editor iframe')[0].contentWindow.rectEdit;
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][0] = coords.left;
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][1] = coords.top;
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][2] = coords.right;
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][3] = coords.bottom;
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][4] = coords.ofsx;
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][5] = coords.ofsy;
            viking.data.sprites[sprite].blit();
              buildFrameLIs();
              $('#action-timeline canvas').click( actionTimelineCanvasClick );
              $('#time-ops .frame').slider( frameSlider() );
              viking.sprites[sprite][action].currentFrame = -1;
              $('#time-ops input[name$=frame]').val(0);
              $('#action-timeline canvas').click( actionTimelineCanvasClick );
              $('#action-frames canvas').removeClass('playingFrame');
              $('#action-frames canvas:eq('+0+')').addClass('playingFrame');
            $('#rect-editor iframe').remove();
            $(this).dialog('close');
          },                    
          'Cancel': function(){
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][0] = this.prevCoords[0];
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][0] = this.prevCoords[1];
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][0] = this.prevCoords[2];
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][0] = this.prevCoords[3];
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][0] = this.prevCoords[4];
            viking.data.sprites[sprite].rect[viking.data.sprites[sprite].action[action].rects[i]][0] = this.prevCoords[5];
            viking.data.sprites[sprite].blit();
            $('#rect-editor iframe').remove();
            $(this).dialog('close');
          }
        }
      });
      $('#rect-editor').append( '<iframe src="rect-edit/index.html?'+(+new Date())+'"></iframe>' );        
    });

    ////////////////////////////////////////////////////////////////////////////
    // FILL CONTROL WINDOW WITH CONTENT
    ////////////////////////////////////////////////////////////////////////////

    function constrain( aNumber, aMin, aMax ){
      return Math.min( Math.max( aNumber, aMin ), aMax );
    };

    // Toggle the play-pause button image and set playing to false/true
    $('#play-pause').click(function(){
      if(playing){
       $(this).children('img')[0].src="img/player_play.png";
       playing=false; 
      }else{
       $(this).children('img')[0].src="img/player_pause.png";
       playing=true;
      }
    });

    $('#previous').click(function(){
      var currentFrame = viking.sprites[sprite][action].currentFrame -=2;
      if( currentFrame+1 < 0 ){
        currentFrame = viking.sprites[sprite][action].currentFrame = viking.sprites[sprite][action].frames.length-2;
      }
      var nextFrame = viking.sprites[sprite][action].frame();
      var currentFrame = viking.sprites[sprite][action].currentFrame;
      ctx.clearRect( 0, 0, 64, 64 );
      ctx.putImageData( nextFrame, 0, 0 );
      updateBitmapTexture();
      $('#time-ops input[name$=frame]').val( currentFrame );
      $('#time-ops .frame').slider({value: currentFrame });
      $('#action-frames canvas').removeClass('playingFrame');
      $('#action-frames canvas:eq('+currentFrame+')').addClass('playingFrame');
    });

    $('#next').click(function(){
      var nextFrame = viking.sprites[sprite][action].frame();
      var currentFrame = viking.sprites[sprite][action].currentFrame;
      $('#time-ops input[name$=frame]').val( currentFrame );
      $('#time-ops .frame').slider({value: currentFrame });
      ctx.clearRect( 0, 0, 64, 64 );
      ctx.putImageData( nextFrame, 0, 0 );
      updateBitmapTexture();
      $('#action-frames canvas').removeClass('playingFrame');
      $('#action-frames canvas:eq('+currentFrame+')').addClass('playingFrame');
    });



    // ACTION //
    //--------//

    var frameSlider = function(){
      return {
        min     : 0,
        max     : viking.sprites[viking.sprite][viking.action].frames.length-1,
        value   : 0,
        slide   : function( e, ui ){
          $('#time-ops input[name$=frame]').val( ui.value );
          viking.sprites[sprite][action].currentFrame = ui.value-1;
          var nextFrame = viking.sprites[sprite][action].frame();
          ctx.clearRect( 0, 0, 64, 64 );
          ctx.putImageData( nextFrame, 0, 0 );
          updateBitmapTexture();
          $('#action-frames canvas').removeClass('playingFrame');
          $('#action-frames canvas:eq('+ui.value+')').addClass('playingFrame');
          if(!playing){
            playing = true;
            viking.sprites[sprite][action].currentFrame = ui.value-1;
            drawFrame();
            playing = false;
          }
        }
      };
    };

    $('#time-ops .frame').slider( frameSlider() );
    
    $('#time-ops input[name$=frame]').change(function(){
      $('#time-ops .frame').slider({value: constrain( $('#time-ops input[name$=frame]').val(), 0, viking.sprites[sprite][action].frames.length -1 ) } );
      viking.sprites[sprite][action].currentFrame = $(this).val()-1;
      viking.sprites[sprite][action].frame();
      var nextFrame = viking.sprites[sprite][action].frame();
      ctx.clearRect( 0, 0, 64, 64 );
      ctx.putImageData( nextFrame, 0, 0 );
      updateBitmapTexture();
      $('#action-frames canvas').removeClass('playingFrame');
      $('#action-frames canvas:eq('+$(this).val()+')').addClass('playingFrame');      
    });


    // Info //
    //------//
    
    $('input[name$="sprite-name"]').val( viking.data.sprites[sprite].name );
    $('input[name$="sprite-author"]').val( viking.data.sprites[sprite].author );
    $('input[name$="sprite-website"]').val( viking.data.sprites[sprite].website );
    $('textarea[name$="sprite-notes"]').val( viking.data.sprites[sprite].notes );

    // Provide DataURI & Update Sprite when DataURI is pasted
    var infoDataURI = $('textarea[name$="sprite-datauri"]');
    infoDataURI.val( viking.data.sprites[sprite].datauri );
    infoDataURI.change(function(e){
      try{
        viking.data.sprites[sprite].reInit( infoDataURI.val() );
      }catch(e){
        //console.log( e );
      }
    })


    // Cloud //
    //-------//

    // Output JSON preview to new window
    $('#preview-json').click(function(){
      var previewJSON = window.open('','Sprite-Viking: JSON EXport Preview - ' +new Date() );
      var thisSprite = viking.data.sprites[sprite];
      var newJSON = {
        name    : thisSprite.name,
        notes   : thisSprite.notes,
        author  : thisSprite.author,
        website : thisSprite.website,
        datauri : thisSprite.datauri,
        rect    : thisSprite.rect,
        action  : thisSprite.action
      };
      previewJSON.document.write( "<pre>"+JSON.stringify(newJSON, null, 2)+"</pre>" );
    });


    ////////////////////////////////////////////////////////////////////////////
    // UI INITIALIZATION
    ////////////////////////////////////////////////////////////////////////////  

    // Create the Control Dialog & Bounce-Fade in
    $('#controls').dialog({
      title   : 'Sprite-Viking Control',
      width   : 400,
      resizable: false
    });
    $('#controls').parent().css({opacity:'0'}).animate({opacity:'1',top:'20px',left:($(window).width()-400)+'px'},1500,'easeOutBounce');
    
    // Switch Acrodian On
		$(".accordion").accordion({ header: "h3" }); //.sortable();

    $('#imgView')[0].addEventListener('dragover', function(e){
      $('#imgView').addClass('dragover');
      e.preventDefault();
    }, true);

    $('#imgView')[0].addEventListener('drop', function(e){

      $('#imgView').removeClass('dragover');
      
        var file = e.dataTransfer.files[0],
            imageType = /image.*/,
            img, 
            reader;

        if(file.type.match(imageType)) {
          img = document.createElement("img"),
          reader = new FileReader();
          reader.onloadend = function() {
            img.src = reader.result;
            viking.data.sprites[sprite].reInit(reader.result);
          }
          reader.readAsDataURL(file);
        }

        e.preventDefault();
        return false;
      }, true);    
    
  };
  
  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
  
  document.addEventListener('DOMContentLoaded', function(){ webGLStart(); run(); }, false);
  
})(document);
