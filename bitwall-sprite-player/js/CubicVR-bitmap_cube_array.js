var BitmapCubeArray = function(width,height,texture,spacing)
{
  this.mesh = new CubicVR.Mesh();
  this.width = width;
  this.height = height;
  this.texture = texture;
  this.mat = new CubicVR.Material();
  this.spacing  = spacing;
  if (texture) this.changeTexture(texture);
	this.genBoxArray(spacing);
	this.frameCount=0;
}


BitmapCubeArray.prototype.changeTexture = function()
{
  this.mat.setTexture(this.texture,CubicVR.enums.texture.map.COLOR);
  //this.mat.setTexture(this.texture,CubicVR.enums.texture.map.ALPHA);    
}



BitmapCubeArray.prototype.genBoxArray = function(){
  
  this.tmpMesh = new CubicVR.Mesh();
  this.cDiv = (this.width>this.height)?(1.0/this.height):(1.0/this.width);  

  this.trans = new CubicVR.Transform();

  this.trans.clearStack();
  this.trans.scale([1,1,1]);

  
//	CubicVR.genBoxObject(this.tmpMesh,this.cDiv,this.mat,this.trans);
//	this.tmpMesh.faces = [this.tmpMesh.faces[0],this.tmpMesh.faces[2],this.tmpMesh.faces[4],this.tmpMesh.faces[5]];
//	this.tmpMesh.faces = [this.tmpMesh.faces[0],this.tmpMesh.faces[1],this.tmpMesh.faces[2],this.tmpMesh.faces[4]];

  CubicVR.genPlaneObject(this.tmpMesh,1.0,this.mat);
  
  this.tmpMesh.faces[0].uvs = [[1,0],[1,1],[0,1],[0,0]];
  this.tmpMesh.faces[1].uvs = [[0,0],[0,1],[1,1],[1,0]];
  
  for (var i = -0.05; i < 0.05; i+=0.1/20.0)
  {
      this.trans.clearStack();
      this.trans.translate([0,0,i]);
      this.mesh.booleanAdd(this.tmpMesh,this.trans);    
  }
  

  // if (typeof(this.spacing) !== 'undefined') this.cDiv *= 1.0+this.spacing;
  // this.iInc = 1.0/this.width;
  // this.jInc = 1.0/this.height;
  
//  this.iOfs = this.iInc/2.0, this.jOfs = this.jInc/2.0;

  // this.fMax = this.tmpMesh.faces.length;
  // 
  // for (var i = 0; i < this.width; i ++)
  // {
  //   for (var j = 0; j < this.height; j++)
  //   {
  //     var u = this.iInc*i+this.iOfs, v = this.jInc*j+this.jOfs;
  // 
  //     for (var f = 0; f < this.fMax; f++)
  //     {
  //       for (var p = 0, pMax = this.tmpMesh.faces[f].points.length; p < pMax; p++)
  //       {
  //         this.tmpMesh.faces[f].uvs[p] = [u,v];
  //       }
  //     }
  //     
  //     this.trans.clearStack();
  //     // this.trans.translate([(this.cDiv*i)-0.5,(this.cDiv*j)-0.5,Math.sqrt(i+j)/7 ]);
  //    this.trans.translate([(this.cDiv*i)-0.5,(this.cDiv*j)-0.5,0]);
  //     
  //     this.mesh.booleanAdd(this.tmpMesh,this.trans);
  //   }          
  // }

	this.mesh.calcNormals();
	this.mesh.triangulateQuads();
	this.mesh.compile();
}
