
  ( function( global ){

    var top     = 20,
        left    = 20,
        bottom  = 80,
        right   = 80,
        ofsx    = 0,
        ofsy    = 0;

    function dist(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    function constrain(aNumber, aMin, aMax) {
      return Math.min(Math.max(aNumber, aMin), aMax);
    };

    function RectEdit(){};

    RectEdit.prototype.load = function( DATAURL, rect, updateCallback ){
      this.canvas = document.getElementById( 'sheet' );
      this.context = this.canvas.getContext( '2d' );
      this.rect = document.getElementById( 'rect' );
      this.rect = this.rect.getContext( '2d' );
      this.rect.mozImageSmoothingEnabled = false; 
      this.context.mozImageSmoothingEnabled = false; 
      this.prevCanvas = document.getElementById( 'preview' );
      this.prevContext = this.prevCanvas.getContext( '2d' );
      this.prevContext.mozImageSmoothingEnabled = false;
      var mouseX    = 0,
          mouseY    = 0,
          mouse2X   = 0,
          mouse2Y   = 0,
          ofsXX     = 0,
          ofsYY     = 0,
          link      = this,
          img       = new Image()
      ;

      if( rect ){
        left    = rect[0];
        top     = rect[1];
        right   = rect[2];
        bottom  = rect[3];
        ofsx    = rect[4];
        ofsy    = rect[5];
      }

     // Update the link-back object to previous window(editor)
      function updateLink( reBlit ){
        link.left   = ~~left;
        link.right  = ~~right;
        link.top    = ~~top;
        link.bottom = ~~bottom;
        link.ofsx   = ~~ofsx;
        link.ofsy   = ~~ofsy;

        var viking = window.parent.window.viking,
            i = viking.selectedRectNumber;
       
        //console.log((+new Date) + ': Updating...');
       
        viking.data.sprites[viking.sprite].rect[i][0] = left;
        viking.data.sprites[viking.sprite].rect[i][1] = top;
        viking.data.sprites[viking.sprite].rect[i][2] = right;
        viking.data.sprites[viking.sprite].rect[i][3] = bottom;
        viking.data.sprites[viking.sprite].rect[i][4] = ~~ofsx;
        viking.data.sprites[viking.sprite].rect[i][5] = ~~ofsy;

        /*if( reBlit ){
          viking.data.sprites[viking.sprite].blit();
          var canvas = window.parent.window.$('.sprite-rects .rect:eq('+viking.selectedRectNumber+')').children('canvas')[0];
          canvas.setAttribute('width', 42);
          canvas.setAttribute('height', 42);
          var context=canvas.getContext('2d');
          context.putImageData(viking.data.sprites[viking.sprite].blits[viking.selectedRectNumber], 0, 0);
        }*/
        
      };

      img.addEventListener( 'load', function(){

        link.context.clearRect( 0, 0, link.context.canvas.width, link.context.canvas.height );

        link.context.drawImage( this, 0, 0 );
        var blitCanvas = document.createElement( 'canvas' );
        blitCanvas.width = ~~right-left;
        blitCanvas.height = ~~bottom-top;                        
        blitCanvas.setAttribute('style', 'border:1px solid black;');
        var blitContext = blitCanvas.getContext( '2d' );
        if( right <= left ){ right=left+1; }
        if( bottom <= top ){ bottom=top+1; }
        var pixels = link.context.getImageData( left, top, right-left, bottom-top );
        blitContext.putImageData(pixels, 0, 0);

        var dataUrl = blitContext.canvas.toDataURL(),
        imgBlit = new Image();
        imgBlit.addEventListener( 'load', function(){
          try{
          
            var scx = link.rect.canvas.width / (right-left),
                scy = link.rect.canvas.height / (bottom-top);
            link.rect.clearRect(0, 0, link.rect.canvas.width, link.rect.canvas.height);

            link.rect.save();
              link.rect.scale( scx, scy );
              link.rect.drawImage( this, 0, 0 );
            link.rect.restore();

            var c = link.rect;
            c.shadowBlur     = 1.5;
            c.shadowOffsetX  = 2.5;
            c.shadowOffsetY  = 2.5;
            c.shadowColor    = "rgba(0, 0, 0, 1)";
            c.strokeStyle    = '#0F0'; 
            c.lineWidth      = 2.5;
            c.strokeRect( 0, 0, 64*scx, 64*scy);

            c.shadowBlur = 0;  
            c.shadowOffsetX = 0;
            c.shadowOffsetY = 0;

            link.prevContext.clearRect( 0, 0, link.prevContext.canvas.width, link.prevContext.canvas.height );
            link.prevContext.save();
              link.prevContext.scale( 3.2, 3.2 );
              link.prevContext.drawImage( this, ofsx + ofsXX , ofsy + ofsYY );
            link.prevContext.restore();
              
            }catch(e){
              console.log( e );
            }
        }, false );
        imgBlit.src = dataUrl;
        
        link.context.shadowBlur = 1.5;  
        link.context.shadowOffsetX = 2.5;
        link.context.shadowOffsetY = 2.5;
        link.context.shadowColor = "rgba(0, 0, 0, 1)";
        link.context.strokeStyle = '#0F0'; 
        link.context.lineWidth = 2.5;
        link.context.strokeRect( left, top, right-left, bottom-top );

        link.context.shadowOffsetX = 0;
        link.context.shadowOffsetY = 0;
        link.context.shadowBlur = 2; 

        var diam;
  
        if( mouseSelected === 'top-left-corner' ){
          link.context.fillStyle    = "#AA0";
          link.context.strokeStyle  = "#FF0";
          diam = 12;
        }else{
          link.context.fillStyle    = "#FF0";
          link.context.strokeStyle  = "#FF0";
          diam = 4;
        }

        link.context.beginPath();
        link.context.arc(left,top,diam,0,Math.PI*2,false);
        link.context.closePath();
        link.context.fill();
        link.context.stroke();

        if( mouseSelected === 'bottom-right-corner' ){
          link.context.fillStyle    = "#AA0";
          link.context.strokeStyle  = "#FF0";
          diam = 12;
        }else{
          link.context.fillStyle    = "#FF0";
          link.context.strokeStyle  = "#FF0";
          diam = 4;
        }

        link.context.beginPath();
        link.context.arc(right,bottom,diam,0,Math.PI*2,false);
        link.context.closePath();
        link.context.fill();
        link.context.stroke();
        
        link.context.shadowBlur = 0;  
        link.context.shadowOffsetX = 0;
        link.context.shadowOffsetY = 0;

      }, false );

      img.src = DATAURL;

      var shiftDown = false;
      
      global.addEventListener( 'keydown', function( e ){
        //console.log( e.keyCode, e.charCode );
        if( e.keyCode === 16 ){
          if( shiftDown ){
             shiftDown = false;
          }else{
             shiftDown = true;
          }
        }
      }, false);

      global.addEventListener( 'keyup', function( e ){

      }, false);

      global.addEventListener( 'keypress', function( e ){
        //console.log( e.keyCode, e.charCode );

        var d = shiftDown ? 10 : 1;

        //console.log( shiftDown, d );

        if( e.keyCode == 34  ){ ofsx += d; }
        if( e.keyCode == 35  ){ ofsy += d; }
        if( e.keyCode == 36  ){ ofsy -= d; }
        if( e.keyCode == 46  ){ ofsx -= d; }

        var width   = link.rect.canvas.width, height  = link.rect.canvas.height;
        /* LEFT   < left  */ if( e.charCode == 97  ){ left    = constrain( left   -=d, 0, width  ); }
        /* LEFT   - right */ if( e.charCode == 100 ){ left    = constrain( left   +=d, 0, width  ); }
        /* TOP    > up    */ if( e.charCode == 119 ){ top     = constrain( top    -=d, 0, height ); }
        /* TOP    + down  */ if( e.charCode == 115 ){ top     = constrain( top    +=d, 0, height ); }
        /* RIGHT  < left  */ if( e.keyCode  == 37  ){ right   = constrain( right  -=d, 0, width  ); }
        /* RIGHT  > right */ if( e.keyCode  == 39  ){ right   = constrain( right  +=d, 0, width  ); }
        /* BOTTOM + up    */ if( e.keyCode  == 40  ){ bottom  = constrain( bottom +=d, 0, height ); }
        /* BOTTOM - down  */ if( e.keyCode  == 38  ){ bottom  = constrain( bottom -=d, 0, height ); }

        img.src = DATAURL;

        rectEdit.lastUpdted = +new Date();

        try{
          clearInterval( rectEdit.interval );
        }catch(e){
          console.log(e);
        }

        rectEdit.interval = setInterval( function(){
          console.log( rectEdit );
          if( +new Date() - rectEdit.lastUpdated > 1000 ){
            updateLink( true );
            clearInterval( rectEdit.interval );
          }
        }, 300 );

      }, false );

      var mouseOver      = false,
          mouseOver2     = false,
          mouseDown      = false,
          mouseDown2     = false,
          mouseSelected  = null,
          mouseGrabX     = 0,
          mouseGrabY     = 0,
          mouseGrab2X    = 0,
          mouseGrab2Y    = 0
          ;

      this.lastUpdated = +new Date();

      link.prevCanvas.addEventListener( 'mousedown', function( e ){
        mouseGrab2X = mouse2X;
        mouseGrab2Y = mouse2Y;
        if( mouseDown2 ){
          mouseDown2 = false;
        }else{
          mouseDown2 = true;
        }
        updateLink();
      }, false );

      link.prevCanvas.addEventListener( 'mouseup', function( e ){
        if( mouseDown2 ){
          mouseDown2 = false;
          ofsx += ofsXX;
          ofsy += ofsYY;
          ofsXX = 0;
          ofsYY = 0;
        }else{
          mouseDown2 = true;
        }
        updateLink();
      }, false );

      global.addEventListener( 'mousedown', function( e ){
        if( mouseDown ){
          mouseDown = false;
        }else{
          mouseDown = true;
        }
        updateLink();
      }, false );

      global.addEventListener( 'mouseup', function( e ){
        if( mouseDown ){
          mouseDown = false;
          mouseSelected="";
        }
        updateLink( true );
      }, false );

      global.addEventListener( 'mousemove', function( e ){
      
        var scrollX = (window.scrollX !== null && typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset;
        var scrollY = (window.scrollY !== null && typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset;
        mouseX = e.clientX - link.canvas.offsetLeft + scrollX;
        mouseY = e.clientY - link.canvas.offsetTop + scrollY;

        if( !mouseDown ){
          if( dist( mouseX, mouseY, left, top) < 8){
            mouseOver = true;
            mouseSelected = 'top-left-corner';
            document.body.style.cursor='nw-resize';
            img.src = DATAURL;
          }else if( dist( mouseX, mouseY, right, bottom ) < 8){
            mouseOver = true;
            mouseSelected = 'bottom-right-corner';
            document.body.style.cursor='se-resize';
            img.src = DATAURL;
          }else if( mouseX > left && mouseX < right && mouseY > top && mouseY < bottom){
            mouseOver = true;
            mouseSelected = 'move';
            document.body.style.cursor='move';
            mouseGrabX = mouseX - left;
            mouseGrabY = mouseY - top;
            img.src = DATAURL;
          }else{
            mouseOver = false;
            mouseSelected = null;
            document.body.style.cursor='auto';
            img.src = DATAURL;
          }
        }

        if( mouseDown ){
          if( mouseSelected === 'top-left-corner' ){
            left    = constrain( mouseX, 0, link.canvas.width );
            top     = constrain( mouseY, 0, link.canvas.height );
            img.src = DATAURL;
          }
          if( mouseSelected === 'bottom-right-corner' ){
            right   = constrain( mouseX, 0, link.canvas.width );
            bottom  = constrain( mouseY, 0, link.canvas.height );
            img.src = DATAURL;
          }
          if( mouseSelected === 'move' ){
            var xdif = right-left,
                ydif = bottom-top;
            right    = constrain( (mouseX -mouseGrabX)+xdif, 0, link.canvas.width);
            bottom   = constrain( (mouseY -mouseGrabY)+ydif, 0, link.canvas.height);
            left     = constrain( mouseX - mouseGrabX, 0, link.canvas.width );
            top      = constrain( mouseY - mouseGrabY, 0, link.canvas.height );
            img.src  = DATAURL;
          }
          updateLink();
        }

        mouse2X = e.clientX - link.prevContext.canvas.offsetLeft + scrollX;
        mouse2Y = e.clientY - link.prevContext.canvas.offsetTop + scrollY;

        if( mouse2X > -1 && mouse2Y > -1 && mouse2X < link.prevContext.canvas.width && mouse2Y < link.prevContext.canvas.height ){          
          mouseOver2 = true;
          if( mouseDown2 ){
            ofsXX = ( mouse2X - mouseGrab2X )/5;
            ofsYY = ( mouse2Y - mouseGrab2Y )/5;
            img.src = DATAURL;
          }
        }else{
          mouseOver2 = false;
        }
        
      }, false );

    };

    window.rectEdit = new RectEdit();

    global.addEventListener( 'DOMContentLoaded', function(){
      var viking = window.parent.viking;
      rectEdit.load(
        viking.data.sprites[viking.sprite].datauri,
        viking.data.sprites[viking.sprite].rect[viking.selectedRectNumber],
        function(){}
      );
    }, false );
    
  } )( window );


