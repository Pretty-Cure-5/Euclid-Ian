"use strict";

/* global THREE */

/**
 * WebGL 3D application, inherits from SAGE2_WebGLApp
 *
 * @class Euclidian3d
 */
var Euclidian3d = SAGE2_WebGLApp.extend({
   
        init: function(data) {
	   
	    this.build(data);
  
        },
   
   
   
	 build: function(data){

    	this.SAGE2Init("div", data);
		this.resizeEvents = "continuous";
		this.element.id = "div" + data.id;
		console.log(data.id);
		
	
		this.modelNumber =3;
		
		this.coOef =100;
		this.Size = this.coOef*0.01;//vertex particle size
        this.frame  = 0;
        this.width  = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.windowHalfX=this.width/2;
        this.windowHalfY=this.height/2;
        var fieldOfView=45;
        var aspectRatio=this.width/this.height;
        var nearPlane=1;
        var farPlane=100000;
        var cameraZ=farPlane/3;
        var fogHex=0x000000;
        var fogDensity=0.5007;
        this.materials=[];
        
        this.mouseX=0;
        this.mouseY=0;
		this.maxFPS=24;
        this.dragging = false;
       
	    this.camera   = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        
		this.camera.position.set(0,5.2*this.coOef,0);
		
        //controls
        this.orbitControls = new THREE.OrbitControls(this.camera, this.element);
		this.scrollAmount=0;
		this.orbitControls.autoRotate  = true;
		this.orbitControls.zoomSpeed   = 1.0;
		this.speed = 0;
		this.orbitControls.autoRotateSpeed = this.speed; 
		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(new THREE.Color(0xc0c0c0,1.0));//0xC0C0C0
        this.renderer.setSize(this.width, this.height);
        this.element.appendChild(this.renderer.domElement);
		
		
		
		
		
		this.scene    = new THREE.Scene();
        this.sceneFunction(data);
		
		
		
		
	},
	
	sceneFunction: function (data){	
	
	this.particles=null;
	this.geometry=null;
	this.geometry=new THREE.Geometry();
	
	 this.dataxyz = datamenuXYZ[this.modelNumber];
	 this.ModCount = Object.keys(datamenuXYZ).length;
	 this.particleCount=Object.keys(this.dataxyz).length;
	 console.log("model number: "+ this.modelNumber);
	
	
	

	/* adding floor
		        var floorspace = new THREE.BoxGeometry(this.coOef*3.5, 0, this.coOef*2.5);
		        var floorcolor = new THREE.Color("#E7FEFF");
	            var floorMaterial = new THREE.MeshBasicMaterial({color: floorcolor});
		        var floor = new THREE.Mesh(floorspace, floorMaterial);
		
		        floor.castShadow = false;
	            floor.position.x = 0; 
		        floor.position.y = 0;
		        floor.position.z = 0;
		  //     this.scene.add(floor);
		  */

	    //this is the loop that reads the data from the .js file this.dataxyz
	    this.dataLoop(data);
	    
		//place the loop data into the pointcloud	  
	    this.particles = new THREE.PointCloud(this.geometry, new THREE.PointCloudMaterial({
		size: this.Size, vertexColors:true, opacity:0.7}));
       
	   //add the point cloud to the scene
	    this.scene.add(this.particles);
		
		//establish the rendererrererere
        
        this.renderer.render(this.scene, this.camera);
		
		console.log(this.renderer.getContext());  
		console.log(this.renderer.info);
		
        //adding the custom widgetbuttons		
		this.widgetButtons(data);  
		
        //adding the info section		
		this.infoFunction(data);  
		
		
	},
	
    dataLoop: function (data){

	for (var i=1;i<this.particleCount;i++) {
           
     		
            var coOrd=this.dataxyz[i];
            var vertex = new THREE.Vector3();
			this.vertexTop = new THREE.Vector3();
			this.vertexBottom = new THREE.Vector3();
						
			vertex.x = coOrd[0] * this.coOef;
            vertex.y = (coOrd[2] * this.coOef-this.coOef*2.5)*-1;
            vertex.z = coOrd[1] * this.coOef;
			
			if(coOrd[2]){
			
            this.vertexTop.x = vertex.x;
            this.vertexTop.y = vertex.y*.999;
            this.vertexTop.z = vertex.z;
			
			this.vertexBottom.x = vertex.x;
            this.vertexBottom.y = vertex.y*1.01;
            this.vertexBottom.z = vertex.z;
			
           
			/* old check to find floating xyz tags
			
			var Y=vertex.y;
			var X=vertex.x;
			var Z=vertex.z;		
			if (i>2){
			var OLDY= (this.dataxyz[i-1][2]*this.coOef-(this.coOef*2.5))*-1;
			var OLDX= (this.dataxyz[i-1][0]*this.coOef);
			var OLDZ= (this.dataxyz[i-1][1]*this.coOef);
		    }
		
		   if (i<this.particleCount-1){
		   var NEWY= (this.dataxyz[i+1][2]*this.coOef-(this.coOef*2.5))*-1;
		   var NEWX= (this.dataxyz[i+1][0]*this.coOef);
		    var NEWZ= (this.dataxyz[i+1][1]*this.coOef);
		    }
			
			console.log(0x00308F/this.dataxyz[i][2]);
		*/
		
		
		    var hexString=0x00308F/this.dataxyz[i][2]*5;
			var vertexColor = new THREE.Color(hexString);
		   
		   					
				this.geometry.vertices.push(this.vertexTop);
				this.geometry.colors.push(vertexColor);
				this.geometry.vertices.push(this.vertexBottom);
				this.geometry.colors.push(vertexColor);
				this.geometry.vertices.push(vertex);
				this.geometry.colors.push(vertexColor);
				
				
				
				/* this is the solid to ground loop
					if(Y<this.coOef*1.1){
					var TG=0;
					/*while (Y>0){
					var vertexToground = "vtx"+TG;
					TG++;
					Y=Y-(this.coOef*.02);
					this.vertexToground= new THREE.Vector3();
					this.vertexToground.x=vertex.x;
					this.vertexToground.y= Y;
					this.vertexToground.z=vertex.z;
					this.geometry.vertices.push(this.vertexToground);
				    this.geometry.colors.push(vertexColor);
					}}*/
			
			      }
	
	           }//end of the check coord[1] size if
        
	},

	
	
	widgetButtons: function(data){	
		this.controls.addButton({type: "fastforward", position: 7, identifier: "Spin+"});
		this.controls.addButton({type: "rewind", position: 8, identifier: "Spin-"});
		this.controls.addButton({type: "new", position: 4, identifier: "ModelDetails"});
		this.controls.addButton({type: "next", position: 1, identifier: "NextModel"});
		this.controls.addButton({type: "prev", position: 2, identifier: "PrevModel"});
        this.controls.finishedAddingControls();
						
		
    },
	
	infoTitleFunction: function (data){
	
	//TODO- this is to supply some minor info on the  header, work in progress 
	
	this.AppTitle = document.getElementById(data.id+"_title");
	this.titleStatus = this.AppTitle.childNodes[4];
	this.titleStatus.className = "apptitleupdate";
	console.log(this.titleStatus.className);
	//style="line-height: 27px; font-size: 16px; color: rgb(255, 255, 255); margin-left: 7px;"
	this.titleStatus.text = document.createTextNode("___Model: "+(this.modelNumber+1) + " / " + this.ModCount);
	this.titleStatus.appendChild(this.titleStatus.text);
	this.AppTitle.appendChild(this.titleStatus);
	
		
	},
	
	
	infoFunction: function(data)   {
	
	//TODO create custom css for all the style elements
	
	this.info = document.createElement('div'); 
	this.info.id = "infoEuclidian";
	this.info.className = "info";
    this.info.style.position = "absolute";
	this.info.style.width    = "25%";
	//this.info.style.height   = "45%";
	this.info.style.top      = "10px";
	this.info.style.left     = "30px";
	this.info.style.backgroundColor = "rgba(200,215,205,0.9)";
	//this.info.style.border   = "none";



	this.title = document.createElement("H1");
	this.title.style.position = "relative";
	this.title.style.left ="15%";
	this.title.style.fontSize = "200%";
	this.title.style.color = "rgba(0,0,255,0.5)";
	
	this.title.text = document.createTextNode("Model Details");
	this.title.appendChild(this.title.text);
	this.info.appendChild(this.title);
	
	
	// this meta data needs to be implemented into the datamenu.js 
	var metadata=this.dataxyz[0];
	for(var m=0;m<7;m++){
		
	this.details = document.createElement("H2");
	this.details.style.position = "relative";
	this.details.style.left     = "2%";
	this.details.style.top      = "1%";
	this.details.style.color    = "rgba(2,5,5)";
	this.details.style.fontSize = "150%";
	
	this.details.text = document.createTextNode(metadata[m]);
	this.details.appendChild(this.details.text);
	this.info.appendChild(this.details);
	}
	
	this.details = document.createElement("H1");
	this.details.style.position = "relative";
	this.details.style.left     = "3%";
	this.details.style.top      = "5%";
	this.details.style.color    = "rgba(2,5,5,3)";
	
    this.details.text = document.createTextNode("Model: "+(this.modelNumber+1) + " / " + this.ModCount);
	this.details.appendChild(this.details.text);
	this.info.appendChild(this.details);
	this.element.appendChild(this.info);
	
   },
   
   
    clearTheScene: function(data){
		
		this.scene.remove(this.particles);
		// this.renderer.clear();
	  // this.scene    = new THREE.Scene();
			  this.manualdraw(date);	
			  this.refresh(data);
			   console.log("clearScene");
	   
	   
   },
   
    infoguiHideShow: function(data) {
		
		if(this.info.style.display=="none"){
			this.info.style.display = "block";
			}
			else{this.info.style.display = "none";}
				
				
						this.manualdraw(data);						
						
		
		
    },

    load: function(date) {
		
		
    },

	//draw is continuous
    draw: function(date) {
		
		this.firstTime=Date.now();
		
		if(this.speed!=0){
		setTimeout( function(){
	   
		},1000/30);
		 this.orbitControls.update();//this is for the <<spin>>
		this.renderer.render(this.scene, this.camera);
		 //this.refresh(date);
		}
		this.lastTime=Date.now();
		//console.log(this.lastTime-this.firstTime);
		},
		
	manualdraw: function(date) {
		
		this.renderer.render(this.scene, this.camera);
		
		
		},
		
	updateModel: function(data){
		
		    this.element.removeChild(this.info);
			this.scene.remove(this.particles);
			//this.titleStatus.remove(this.titleStatus.text);
			this.sceneFunction(data);
			
			
		
		
	},	
			
		
    resize: function(date) {
        this.width  = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.renderer.setSize(this.width, this.height);
        this.refresh(date);
    },

    event: function(eventType, position, user_id, data, date) {
        if(eventType==="pointerPress" && (data.button==="left")) {
						
            this.orbitControls.mouseDown(position.x,position.y,0);
			console.log(this.camera.position);
			this.dragging=true;
            this.refresh(date);
			
        }
		
		
		else if (eventType==="pointerMove" && this.dragging)
		{
			this.orbitControls.update();
		    this.renderer.render(this.scene, this.camera);
			this.orbitControls.mouseMove(position.x,position.y);
			this.refresh(date);
		}
		
		else if (eventType === "pointerRelease" && (data.button === "left")) {
				this.dragging = false;
			}
			
		else if(eventType==="pointerScroll"){
			
			this.scrollAmount = data.wheelDelta;
			console.log("scrolling");
			console.log(this.scrollAmount/10);	
			this.orbitControls.scale((this.scrollAmount/10)*-1);
			this.manualdraw(data);
			
		}	
		
		
		else if (eventType==="widgetEvent")
		{
			switch (data.identifier) {
			
			case "Spin+":
			//this.infogui(data);
		             	this.speed++;
						this.orbitControls.autoRotateSpeed = this.speed;
						break;
            case "Spin-":
						this.speed--;
						this.orbitControls.autoRotateSpeed = this.speed;
						break;	
			case "ModelDetails":
						this.infoguiHideShow(data);
						break;	
            case "Clear":
						break;	
            case "NextModel":
			
			if (this.modelNumber<this.ModCount-1){
			this.modelNumber++;
			this.updateModel(data);
			}
						
						break;	
            case "PrevModel":
			
			if(this.modelNumber > 0){
			this.modelNumber--;
			this.updateModel(data);
			}
						break;	
            case "reset":
						
						break;							
			default:
						console.log("No handler for:", data.identifier);
						return;
			
			}
			
			this.refresh(date);
		}
    }
	
	
});
