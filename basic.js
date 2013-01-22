var canvas;
var ctx;//context
var mouse_x = 0;
var mouse_y = 0;
var body_x = 0;
var body_y = 0;

var drag_x = 0;
var drag_y = 0;
var ox = 0;//original shape's x position
var oy = 0;//original shape's y position
var ow = 0;//original width
var oh = 0;//original height

var is_drag = false;
var is_resizing = false;
var body_resizing = false;
var tool_repos = false;
var adv_repos = false;
var lining = false;
var linking = false;
var lining_select = 0;
var resize_dir;
var shapes = [];
var links = [];

var adv_box_record;
var link_box_record;
var mouse_over_toolbox = false;

function init(){
	//jquery installation(used another way)
	/*var script = document.createElement('script');
	script.src = 'http://jqueryjs.googlecode.com/files/jquery-1.2.6.min.js';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);*/

	canvas = document.getElementById("draw_board");
	ctx = canvas.getContext("2d");
	tool_box_reset();
	//advance_box_init();
	adjust_frame();
	mouse_set();
	
	setInterval(draw, 1);
	
	function draw(){
		//clear all
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(i in links){
			links[i].Draw();
		}
		for(i in shapes){
			shapes[i].Draw();
			if(shapes[i].selected){
				//selected border
				ctx.beginPath();
				ctx.moveTo(shapes[i].x, shapes[i].y);
				ctx.lineTo(shapes[i].x + shapes[i].width, shapes[i].y);
				ctx.lineTo(shapes[i].x + shapes[i].width, shapes[i].y + shapes[i].height);
				ctx.lineTo(shapes[i].x, shapes[i].y + shapes[i].height);
				ctx.lineTo(shapes[i].x, shapes[i].y);
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
	
	$("#link_mini").click(function(){
		$("#minimize_tool").fadeToggle();
	});
	
	//change cursor
	$("#link_repos").hover(function(){
		document.body.style.cursor = "move";
	});
	
	$("#link_repos").mouseout(function(){
		document.body.style.cursor = "auto";
	});
	
	//activate reposition
	$("#link_repos").mousedown(function(e){
		drag_x = e.pageX;
		drag_y = e.pageY;
		body_x = $("#tool_box").position().left;
		body_y = $("#tool_box").position().top;
		tool_repos = true;
	});
	
	//repositioning
	$("body").mousemove(function(e){
		if(tool_repos){
			var new_x = body_x + e.pageX - drag_x;
			var new_y = body_y + e.pageY - drag_y;
			$("#tool_box").css("left", new_x);
			$("#tool_box").css("top", new_y);
		} else if(adv_repos){
			var new_x = body_x + e.pageX - drag_x;
			var new_y = body_y + e.pageY - drag_y;
			$("#advance_box").css("left", new_x);
			$("#advance_box").css("top", new_y);
		}
	});
	
	//deactivate reposition
	$("body").mouseup(function(e){
		tool_repos = false;
		adv_repos = false;
	});
}

function adjust_frame(){
	ctx.canvas.width  = window.innerWidth-30;
    ctx.canvas.height = window.innerHeight-30;
	document.getElementById("c_width").value = canvas.width;
	document.getElementById("c_height").value = canvas.height;
}

function manually_adjust_frame(id){
	if(id == "c_width"){
		canvas.width = document.getElementById("c_width").value;
	} else if(id == "c_height"){
		canvas.height = document.getElementById("c_height").value;
	}
}

function tog_tool_box(){
	if(document.getElementById('minimize_tool').innerHTML != ""){
		link_box_record = document.getElementById('minimize_tool').innerHTML;
		document.getElementById('minimize_tool').innerHTML = "";
	} else {
		document.getElementById('minimize_tool').innerHTML = link_box_record;
	}
}

function tool_box_reset(){
	var new_content = "";
	new_content += "<button id='link_mini'>-</button>";
	new_content += "<span id='link_repos'><b>Link Box</b></span><br/>";
	
	new_content += "<span id='minimize_tool'>";
	
	new_content += "<i>Head</i>";
	
	new_content += "<div style='margin-left:15px;'>";
	new_content += "Name<br/><textarea rows='1' id='head_name' onkeyup='update_name(this.id);' style='width:140px;'></textarea><br/>";
	new_content += "Shape<br/>";
	new_content += "<span id='c1' class='selected_shapes' onclick='shape_select(this.id);'><img src='img/circle.png' width='15'></span>";//circle
	new_content += "<span id='o1' class='shapes' onclick='shape_select(this.id);'><img src='img/oval.png' width='15'></span>";//oval
	new_content += "<span id='q1' class='shapes' onclick='shape_select(this.id);'><img src='img/quad.png' width='15'></span>";//quadrilateral
	new_content += "<span id='p1' class='shapes' onclick='shape_select(this.id);'><img src='img/paral.png' width='15'></span>";//parellellogram
	new_content += "<span id='d1' class='shapes' onclick='shape_select(this.id);'><img src='img/diamond.png' width='15'></span><br/>";//diamond
	new_content += "Font Size <input id='font_size_form' type=text style='width:30px;' onkeyup='change_font2();'>";
	new_content += "</div>";
	
	new_content += "<button onclick='create_head();'>Create Head</button><br/>";
	
	new_content += "<i>Tail</i>";
	
	new_content += "<div style='margin-left:15px;'>";
	new_content += "Name<br/><textarea rows='1' id='tail_name' style='width:140px;'></textarea><br/>";
	new_content += "Shape<br/>";
	new_content += "<span id='c2' class='selected_shapes2' onclick='shape_select2(this.id);'><img src='img/circle.png' width='15'></span>";//circle
	new_content += "<span id='o2' class='shapes2' onclick='shape_select2(this.id);'><img src='img/oval.png' width='15'></span>";//oval
	new_content += "<span id='q2' class='shapes2' onclick='shape_select2(this.id);'><img src='img/quad.png' width='15'></span>";//quadrilateral
	new_content += "<span id='p2' class='shapes2' onclick='shape_select2(this.id);'><img src='img/paral.png' width='15'></span>";//parellellogram
	new_content += "<span id='d2' class='shapes2' onclick='shape_select2(this.id);'><img src='img/diamond.png' width='15'></span>";//diamond
	new_content += "<br/>";
	new_content += "<input name='line' id='line_type' type='radio' >Line 90&#176;";
	new_content += " Arrow<input id='has_arrow' type='checkbox' checked='checked'><br/>";
	new_content += "<input name='line' id='top_down_type' type='radio'>Top-Down";
	new_content += "</div>";
	
	new_content += "<button onclick='create_tail();'>Create Tail</button><br/>";
	
	new_content += "<div id='mouse_track'>0, 0</div>";
	
	new_content += "Width<input id='c_width' style='width:30px;' onkeyup='manually_adjust_frame(id)'>";
	new_content += "Height<input id='c_height' style='width:30px;' onkeyup='manually_adjust_frame(id)'>";
	new_content += "<button onclick='clean_canvas();'>New</button>";
	//new_content += "<button>Open</button>";
	new_content += "<button onclick='save_img();'>Save</button>";
	
	new_content += "</span>";
	
	document.getElementById("tool_box").innerHTML = new_content;
}

function clean_canvas(){
	init();
	shapes = [];
	links = [];
}

function touch_canvas_border(e){
	if(body_x > ctx.canvas.width+5 - 5 && body_x < ctx.canvas.width+5 + 5){
		if(body_y > ctx.canvas.height+5 - 5 && body_y < ctx.canvas.height+5 + 5){
			return "BR";
		} else {
			return "R";
		}
	} else if(body_y > ctx.canvas.height+5 - 5 && body_y < ctx.canvas.height+5 + 5){
		return "B";
	}
	
	return false;
}

function mouse_set(){	
	//var body = document.getElementsByTagName("body")[0];
	//var body = document.getElementById("body");
	var tool_box = document.getElementById("tool_box");
	
	/*body.addEventListener('mousemove', function(e){
		body_x = e.clientX;
		body_y = e.clientY;
	
		//change cursor if touch border
		if(touch_canvas_border(e)){
			switch(touch_canvas_border(e)){
				case "R":
					document.body.style.cursor = "w-resize";
					break;
				case "BR":
					document.body.style.cursor = "se-resize";
					break;
				case "B":
					document.body.style.cursor = "s-resize";
					break;
			}
			
		} else if(mouse_over_toolbox){
			document.body.style.cursor = "auto";
		}
		
		//resizing if resizing started
		if(body_resizing){
			switch(resize_dir){
				case "R":
					canvas.width = body_x;
					break;
				case "BR":
					canvas.width = body_x;
					canvas.height = body_y;
					break;
				case "B":
					canvas.height = body_y;
					break;
			}
		}
	}, false);
	
	body.addEventListener('mousedown', function(e){
		//resize start if touch border and click
		if(touch_canvas_border(e)){
			resize_dir = touch_canvas_border(e);
			ow = canvas.width;
			oh = canvas.height;
			drag_x = body_x;
			drag_y = body_y;
			body_resizing = true;
		}
	}, false);
	
	body.addEventListener('mouseup', function(e){
		body_resizing = false;
	}, false);
	
	tool_box.addEventListener('mouseover', function(e){
		mouse_over_toolbox = true;
	}, false);
	
	tool_box.addEventListener('mouseout', function(e){
		mouse_over_toolbox = false;
	}, false);*/
	
	canvas.addEventListener('mousemove', function(e){
		//update mouse position
		var mousePos = getMousePos(canvas, e);
		mouse_x = mousePos.x;
		mouse_y = mousePos.y;
		document.getElementById("mouse_track").innerHTML = mouse_x+", "+mouse_y;
		//reset
		if(!linking && !lining)
			document.body.style.cursor = "auto";
		
		for(i in shapes){
			if(shapes[i].selected == true){
				//sense line touch
				var touched_line = false;
				for(j in links){
					if(links[j].Touched()){
						touched_line = true;
						break;
					}
				}
			
				//branches below is for change cursor type
				if(linking){
					document.body.style.cursor = "crosshair";
					for(j in shapes){
						if(j != i && shapes[j].Touched()){
							document.body.style.cursor = "pointer";
						}
					}
				} else if(touched_border(i) != "none"){
				//change the cursor
					switch(touched_border(i)){
						case "TL":
							document.body.style.cursor = "nw-resize";
							break;
						case "BR":
							document.body.style.cursor = "se-resize";
							break;
						case "BL":
							document.body.style.cursor = "sw-resize";
							break;
						case "TR":
							document.body.style.cursor = "ne-resize";
							break;
						case "L":
							document.body.style.cursor = "e-resize";
							break;
						case "R":
							document.body.style.cursor = "w-resize";
							break;
						case "T":
							document.body.style.cursor = "n-resize";
							break;
						case "B":
							document.body.style.cursor = "s-resize";
							break;
					}
				} else if(shapes[i].Touched()){
					document.body.style.cursor = "move";
				} else if(touched_line){
					document.body.style.cursor = "n-resize";
				}
				
				//branches below is operation with cursor
				if(linking){
				} else if(is_resizing && is_drag){
					//resize the selected object
					if(shapes[i].shape == "C"){//width and height must me same!
						switch(resize_dir){
							case "TL":
							case "L":
								//change the position
								shapes[i].x = ox + mouse_x - drag_x;
								//change the size 
								shapes[i].width = ow - (mouse_x - drag_x);
								if(shapes[i].width <= 10){
									shapes[i].width = 10;
									shapes[i].x = ow + drag_x - 10;
								}
								shapes[i].height = shapes[i].width;
								break;
							case "BR":
							case "R":
								shapes[i].width = ow + mouse_x - drag_x;
								if(shapes[i].width <= 10)
									shapes[i].width = 10;
								shapes[i].height = shapes[i].width;
								break;
							case "TR":
							case "T":
								//change the position
								shapes[i].y = oy + mouse_y - drag_y;
								//change the size
								shapes[i].height = oh - (mouse_y - drag_y);
								if(shapes[i].height <= 10){
									shapes[i].height = 10;
									shapes[i].y = oh + drag_y - 10;
								}
								shapes[i].width = shapes[i].height;
								break;
							case "BL":
							case "B":
								shapes[i].height = oh + mouse_y - drag_y;
								if(shapes[i].height <= 10)
									shapes[i].height = 10;
								shapes[i].width = shapes[i].height;
								break;
						}
					} else {//height and width not the same, more flexible
						switch(resize_dir){
							case "R":
								shapes[i].width = ow + mouse_x - drag_x;
								if(shapes[i].width < 10) shapes[i].width = 10;
								break;
							case "B":
								shapes[i].height = oh + mouse_y - drag_y;
								if(shapes[i].height < 10) shapes[i].height = 10;
								break;
							case "T":
								//change the position
								shapes[i].y = oy + mouse_y - drag_y;
								//change the size
								shapes[i].height = oh - (mouse_y - drag_y);
								if(shapes[i].height < 10) {
									shapes[i].height = 10;
									shapes[i].y = oh + drag_y - 10;
								}
								break;	
							case "L":
								//change the position
								shapes[i].x = ox + mouse_x - drag_x;
								//change the size 
								shapes[i].width = ow - (mouse_x - drag_x);
								if(shapes[i].width <= 10){
									shapes[i].width = 10;
									shapes[i].x = ow + drag_x - 10;
								}
								break;
							case "TL":
								//change the position
								shapes[i].x = ox + mouse_x - drag_x;
								shapes[i].y = oy + mouse_y - drag_y;
								//change the size
								shapes[i].width = ow - (mouse_x - drag_x);
								if(shapes[i].width <= 10){
									shapes[i].width = 10;
									shapes[i].x = ow + drag_x - 10;
								}
								shapes[i].height = oh - (mouse_y - drag_y);
								if(shapes[i].height < 10) {
									shapes[i].height = 10;
									shapes[i].y = oh + drag_y - 10;
								}
								break;
							case "TR":
								//change the position
								shapes[i].y = oy + mouse_y - drag_y;
								//change the size
								shapes[i].height = oh - (mouse_y - drag_y);
								if(shapes[i].height < 10) {
									shapes[i].height = 10;
									shapes[i].y = oh + drag_y - 10;
								}
								shapes[i].width = ow + mouse_x - drag_x;
								if(shapes[i].width < 10) shapes[i].width = 10;
								break;
							case "BL":
								//change the position
								shapes[i].x = ox + mouse_x - drag_x;
								//change the size
								shapes[i].width = ow - (mouse_x - drag_x);
								if(shapes[i].width <= 10){
									shapes[i].width = 10;
									shapes[i].x = ow + drag_x - 10;
								}
								shapes[i].height = oh + mouse_y - drag_y;
								if(shapes[i].height < 10) shapes[i].height = 10;
								break;
							case "BR":
								shapes[i].width = ow + mouse_x - drag_x;
								if(shapes[i].width < 10) shapes[i].width = 10;
								shapes[i].height = oh + mouse_y - drag_y;
								if(shapes[i].height < 10) shapes[i].height = 10;
								break;
						}
					}
				} else if(lining){
					//move the line
					links[lining_select].base_line = oy + mouse_y - drag_y;
				} else if(is_drag){
					//moving the selected object
					shapes[i].x = ox + mouse_x - drag_x;
					shapes[i].y = oy + mouse_y - drag_y;
				}
				
				break;
			}
		}
		
	}, false);
	
	canvas.addEventListener('mousedown', function(e){
		is_drag = true;
		
		//check line touched
		for(j in links){
			if(links[j].Touched()){
				lining = true;
				lining_select = j;
				drag_x = mouse_x;
				drag_y = mouse_y;
				links[j].user_resize = true;
				//ox = shapes[i].x;
				oy = links[j].base_line;
			}
		}
		
		//close advance box
		document.getElementById('advance_box').className = 'hide';
		
		//linking
		if(linking){
			var line_90 = document.getElementById('adv_line_type').checked;
			var arrow = document.getElementById('adv_arrow').checked;
			var td_arrow = document.getElementById('adv_td_type').checked;
			
			var head = -1;
			for(i in shapes){
				if(shapes[i].selected){
					head = i;
					break;
				}
			}
			var tail = -1;
			for(i in shapes){
				if(shapes[i].Touched()){
					tail = i;
					break;
				}
			}
			
				//links failed
			if(head == -1 || tail == -1 || head == tail){
				//do nothing
			} else {
				//create linker
				var linker;
				if(line_90){
					linker = new S_Arrow(head, tail);
				} else if(td_arrow){
					linker = new Td_Arrow(head, tail);
				} else {
					linker = new Arrow(head, tail);
				}
				//arrow specification
				if(!arrow){
					linker.arrow = false;
				}
				links.push(linker);
				shapes[head].tails.push(tail);
			}
			
			linking = false;
		}
		
		//deselect all the shapes
		for(i in shapes){
			if(shapes[i].selected && !lining){
				selected_effect(false, i);
				document.getElementById('head_name').value = "";
			}
		}
		
		//select the intercepted element
		for(i in shapes){
			if((shapes[i].Touched() || touched_border(i) != "none") && !is_resizing && !lining){//intersected with mouse
				selected_effect(true, i);
				drag_x = mouse_x;
				drag_y = mouse_y;
				ox = shapes[i].x;
				oy = shapes[i].y;
				if(touched_border(i) != "none"){
					resize_dir = touched_border(i);
					ow = shapes[i].width;
					oh = shapes[i].height;
					is_resizing = true;
				}
				break;
			}
		}
		
	}, false);
	
	canvas.addEventListener('mouseup', function(e){
		is_drag = false;
		is_resizing = false;
		lining = false;
	}, false);
	
	canvas.addEventListener('dblclick', function(e){
		for(i in shapes){
			if(shapes[i].selected){
				document.getElementById("advance_box").className = "unhide";
				advance_box_init();
			}
		}
	}, false);
}

function getMousePos(canvas, e){
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left, 
		y: e.clientY - rect.top
	};
}

function save_img(){
	window.open(canvas.toDataURL("image/png"));
}

function shape_select(id){
	var elements = document.getElementsByClassName('selected_shapes');
	//deselect
	for(i in elements){
		elements[i].className = "shapes";
	}
	document.getElementById(id).className = "selected_shapes";
	
	//auto reshape
	for(i in shapes){
		if(shapes[i].selected){
			var object;
			switch(id){
				case "c1":
					object = new Circle(shapes[i].x, shapes[i].y, shapes[i].name);
					break;
				case "o1":
					object = new Oval(shapes[i].x, shapes[i].y, shapes[i].name);
					break;
				case "q1":
					object = new Quadrilateral(shapes[i].x, shapes[i].y, shapes[i].name);
					break;
				case "p1":
					object = new Parallelogram(shapes[i].x, shapes[i].y, shapes[i].name);
					break;
				case "d1":
					object = new Diamond(shapes[i].x, shapes[i].y, shapes[i].name);
					break;
			}
			
			
			if(id == "c1"){//width == height
				object.width = shapes[i].width;
				object.height = shapes[i].width;
			} else {
				object.width = shapes[i].width;
				object.height = shapes[i].height;
			}
			object.detail = shapes[i].detail;
			object.tails = shapes[i].tails;
			object.fsize = shapes[i].fsize;
			object.font = shapes[i].font;
			//swap
			shapes[i] = object;
			selected_effect(true, i);
		}
	}
}

function shape_select2(id){
	var elements = document.getElementsByClassName('selected_shapes2');
	//deselect
	for(i in elements){
		elements[i].className = "shapes2";
	}
	document.getElementById(id).className = "selected_shapes2";
}

function create_head(){
	var heads = document.getElementsByClassName("selected_shapes");
	var object = getShape(heads[0].id);
	if(!Number(document.getElementById("font_size_form").value) && document.getElementById("font_size_form").value != ""){
		alert("Create failed, please enter a valid number.");
		return;
	} else if(document.getElementById("font_size_form").value == ""){
		//do nothing
	} else {
		object.fsize = document.getElementById("font_size_form").value;
	}
	document.getElementById('head_name').value = "";
	shapes.push(object);
}

function create_tail(){
	var head = -1;
	for(i in shapes){
		if(shapes[i].selected){
			head = i;
			break;
		}
	}
	if(head == -1){
		alert("Can't create tail without head.");
		return;
	}
	//tail creation...
	var tails = document.getElementsByClassName("selected_shapes2");
	var object = getShape(tails[0].id);
	//setup position for new tail
	switch(shapes[head].tails.length){
		case 0:
			object.x = shapes[head].x;
			object.y = shapes[head].y + 150;
			break;
		case 1:
			object.x = shapes[head].x;
			object.y = shapes[head].y - 150;
			break;
		case 2:
			object.x = shapes[head].x - 150;
			object.y = shapes[head].y;
			break;
		case 3:
			object.x = shapes[head].x + 150;
			object.y = shapes[head].y;
			break;
		case 4:
			object.x = shapes[head].x - 150;
			object.y = shapes[head].y + 150;
			break;
		case 5:
			object.x = shapes[head].x + 150;
			object.y = shapes[head].y + 150;
			break;
		case 6:
			object.x = shapes[head].x - 150;
			object.y = shapes[head].y - 150;
			break;
		case 7:
			object.x = shapes[head].x + 150;
			object.y = shapes[head].y - 150;
			break;
		default:
			
	}
	//exception
	if(object.x < 0 || object.x > canvas.width - 100 
		|| object.y < 0 || object.y > canvas.height - 100){
			object.x = canvas.width - 150; 
			object.y = 500;
	}
	//ending...
	shapes[head].tails.push(shapes.length);
	document.getElementById('tail_name').value = "";
	object.color = "red";
	shapes.push(object);
	
	//create linker
	var linker;
	if(document.getElementById("top_down_type").checked){
		//new type of line
		linker = new Td_Arrow(head, shapes.length-1);
	} else if(document.getElementById("line_type").checked){
		linker = new S_Arrow(head, shapes.length-1);
	} else {
		linker = new Arrow(head, shapes.length-1);
	}
	//arrow specification
	if(!document.getElementById("has_arrow").checked){
		linker.arrow = false;
	}
	links.push(linker);
}

function Circle(x, y, name){
	this.x = x;
	this.y = y;
	this.name = name;
	//default
	this.width = 50 * 2;
	this.height = 50 * 2;
	
	this.border = "black";
	this.color = "white";
	this.detail = "";
	this.tails = [];
	this.selected = false;
	this.fsize = -1;
	this.font = "Trebuchet MS";
	//special
	this.shape = "C";
}

Circle.prototype.Draw = function(){
	var radius = this.width / 2;
	var center_x = this.x + radius;
	var center_y = this.y + radius;
	//shape
	ctx.beginPath();
	ctx.arc(center_x, center_y, radius, 0, 2*Math.PI);
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.strokeStyle = this.border;
	ctx.stroke();
	ctx.closePath();
	
	//text
	var font_size = Number(this.fsize);
	if(font_size == -1){//auto
		font_size = 30;
		while(font_size * this.name.length > this.width*2){
			font_size--;
		}	
	} 
	ctx.font = font_size+"px "+this.font;
	ctx.textAlign = 'center';
	ctx.fillStyle = this.border;
	//one line
	if(this.name.indexOf("\n") == -1){
		ctx.fillText(this.name, center_x, center_y);
		return;
	}
	//multiple line
	var copy_name = this.name;
	var nl_count = 0;
	while(copy_name.indexOf("\n") != -1){
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);
		nl_count++;
	}
	var start_y = center_y - nl_count * (font_size/2);
	copy_name = this.name;
	while(copy_name.indexOf("\n") != -1){
		var front = copy_name.substr(0, copy_name.indexOf("\n"));
		ctx.fillText(front, center_x, start_y);
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);		
		start_y += font_size;
	}
	ctx.fillText(copy_name, center_x, start_y);
}

Circle.prototype.Touched = function(){
	var radius = this.width / 2;
	var center_x = this.x + radius;
	var center_y = this.y + radius;
	var dx = center_x - mouse_x;
	var dy = center_y - mouse_y;
	if(Math.sqrt(dx*dx+dy*dy) <= radius)
		return true;
	return false;
}

function Oval(x, y, name){
	this.x = x;
	this.y = y;
	this.name = name;
	//default
	this.width = 100;
	this.height = 100;
	
	this.border = "black";
	this.color = "white";
	this.detail = "";
	this.tails = [];
	this.selected = false;
	this.fsize = -1;
	this.font = "Trebuchet MS";
	//special
	this.shape = "O";
}

Oval.prototype.Draw = function(){
	var center_x = this.x + this.width/2;
	var center_y = this.y + this.height/2;
	//shape
	ctx.beginPath();
	ctx.moveTo(center_x - this.width/2, center_y);//A1
	
	ctx.bezierCurveTo(
	center_x - this.width/2, center_y - this.height/2,//C1
	center_x + this.width/2, center_y - this.height/2,//C4
	center_x + this.width/2, center_y);//A2
	
	ctx.bezierCurveTo(
	center_x + this.width/2, center_y + this.height/2,//C3
	center_x - this.width/2, center_y + this.height/2,//C2
	center_x - this.width/2, center_y);//A1
	
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.strokeStyle = this.border;
	ctx.stroke();
	ctx.closePath();
	
	//text
	var font_size = Number(this.fsize);
	if(font_size == -1){//auto
		font_size = 30;
		while(font_size * this.name.length > this.width*2){
			font_size--;
		}	
	} 
	ctx.font = font_size+"px "+this.font;
	ctx.textAlign = 'center';
	ctx.fillStyle = this.border;
	//one line
	if(this.name.indexOf("\n") == -1){
		ctx.fillText(this.name, center_x, center_y);
		return;
	}
	//multiple line
	var copy_name = this.name;
	var nl_count = 0;
	while(copy_name.indexOf("\n") != -1){
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);
		nl_count++;
	}
	var start_y = center_y - nl_count * (font_size/2);
	copy_name = this.name;
	while(copy_name.indexOf("\n") != -1){
		var front = copy_name.substr(0, copy_name.indexOf("\n"));
		ctx.fillText(front, center_x, start_y);
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);		
		start_y += font_size;
	}
	ctx.fillText(copy_name, center_x, start_y);
}

Oval.prototype.Touched = function(){
	if(mouse_x >= this.x && mouse_x <= this.x + this.width &&
		mouse_y >= this.y && mouse_y <= this.y + this.height){
		return true;
	}
	return false;
}

function Quadrilateral(x, y, name){
	this.x = x;
	this.y = y;
	this.name = name;
	//default
	this.width = 100;
	this.height = 70;
	
	this.border = "black";
	this.color = "white";
	this.detail = "";
	this.tails = [];
	this.selected = false;
	this.fsize = -1;
	this.font = "Trebuchet MS";
	//special
	this.shape = "Q";
}

Quadrilateral.prototype.Draw = function(){
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
	ctx.strokeStyle = this.border;
	ctx.strokeRect(this.x, this.y, this.width, this.height);
	
	var center_x = this.x + this.width/2;
	var center_y = this.y + this.height/2;
	//text
	var font_size = Number(this.fsize);
	if(font_size == -1){//auto
		font_size = 30;
		while(font_size * this.name.length > this.width*2){
			font_size--;
		}	
	} 
	ctx.font = font_size+"px "+this.font;
	ctx.textAlign = 'center';
	ctx.fillStyle = this.border;
	//one line
	if(this.name.indexOf("\n") == -1){
		ctx.fillText(this.name, center_x, center_y);
		return;
	}
	//multiple line
	var copy_name = this.name;
	var nl_count = 0;
	while(copy_name.indexOf("\n") != -1){
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);
		nl_count++;
	}
	var start_y = center_y - nl_count * (font_size/2);
	copy_name = this.name;
	while(copy_name.indexOf("\n") != -1){
		var front = copy_name.substr(0, copy_name.indexOf("\n"));
		ctx.fillText(front, center_x, start_y);
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);		
		start_y += font_size;
	}
	ctx.fillText(copy_name, center_x, start_y);
}

Quadrilateral.prototype.Touched = function(){
	if(mouse_x >= this.x && mouse_x <= this.x + this.width &&
		mouse_y >= this.y && mouse_y <= this.y + this.height){
		return true;
	}
	return false;
}

function Parallelogram(x, y, name){
	this.x = x;
	this.y = y;
	this.name = name;
	//default
	this.width = 100;
	this.height = 70;
	
	this.border = "black";
	this.color = "white";
	this.detail = "";
	this.tails = [];
	this.selected = false;
	this.fsize = -1;
	this.font = "Trebuchet MS";
	//special
	this.shape = "P";
}

Parallelogram.prototype.Draw = function(){
	ctx.beginPath();
	ctx.moveTo(this.x+40, this.y);
	ctx.lineTo(this.x + this.width, this.y);
	ctx.lineTo(this.x + this.width - 40, this.y + this.height);
	ctx.lineTo(this.x, this.y + this.height);
	ctx.lineTo(this.x+40, this.y);
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.fillStyle = this.border;
	ctx.stroke();
	ctx.closePath();
	
	var center_x = this.x + this.width/2;
	var center_y = this.y + this.height/2;
	//text
	var font_size = Number(this.fsize);
	if(font_size == -1){//auto
		font_size = 30;
		while(font_size * this.name.length > this.width*2){
			font_size--;
		}	
	} 
	ctx.font = font_size+"px "+this.font;
	ctx.textAlign = 'center';
	ctx.fillStyle = this.border;
	//one line
	if(this.name.indexOf("\n") == -1){
		ctx.fillText(this.name, center_x, center_y);
		return;
	}
	//multiple line
	var copy_name = this.name;
	var nl_count = 0;
	while(copy_name.indexOf("\n") != -1){
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);
		nl_count++;
	}
	var start_y = center_y - nl_count * (font_size/2);
	copy_name = this.name;
	while(copy_name.indexOf("\n") != -1){
		var front = copy_name.substr(0, copy_name.indexOf("\n"));
		ctx.fillText(front, center_x, start_y);
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);		
		start_y += font_size;
	}
	ctx.fillText(copy_name, center_x, start_y);
}

Parallelogram.prototype.Touched = function(){
	if(mouse_x >= this.x && mouse_x <= this.x + this.width &&
		mouse_y >= this.y && mouse_y <= this.y + this.height){
		return true;
	}
	return false;
}

function Diamond(x, y, name){
	this.x = x;
	this.y = y;
	this.name = name;
	//default
	this.width = 100;
	this.height = 70;
	
	this.border = "black";
	this.color = "white";
	this.detail = "";
	this.tails = [];
	this.selected = false;
	this.fsize = -1;
	this.font = "Trebuchet MS";
	//special
	this.shape = "D";
}

Diamond.prototype.Draw = function(){
	ctx.beginPath();
	ctx.moveTo(this.x, this.y + this.height/2);//left
	ctx.lineTo(this.x + this.width/2 ,this.y);//top
	ctx.lineTo(this.x + this.width, this.y + this.height/2);//right
	ctx.lineTo(this.x + this.width/2, this.y + this.height);//bottom
	ctx.lineTo(this.x, this.y + this.height/2);//left
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.fillStyle = this.border;
	ctx.stroke();
	ctx.closePath();
	
	var center_x = this.x + this.width/2;
	var center_y = this.y + this.height/2;
	//text
	var font_size = Number(this.fsize);
	if(font_size == -1){//auto
		font_size = 30;
		while(font_size * this.name.length > this.width*2){
			font_size--;
		}	
	} 
	ctx.font = font_size+"px "+this.font;
	ctx.textAlign = 'center';
	ctx.fillStyle = this.border;
	//one line
	if(this.name.indexOf("\n") == -1){
		ctx.fillText(this.name, center_x, center_y);
		return;
	}
	//multiple line
	var copy_name = this.name;
	var nl_count = 0;
	while(copy_name.indexOf("\n") != -1){
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);
		nl_count++;
	}
	var start_y = center_y - nl_count * (font_size/2);
	copy_name = this.name;
	while(copy_name.indexOf("\n") != -1){
		var front = copy_name.substr(0, copy_name.indexOf("\n"));
		ctx.fillText(front, center_x, start_y);
		copy_name = copy_name.substr(copy_name.indexOf("\n") + 1);		
		start_y += font_size;
	}
	ctx.fillText(copy_name, center_x, start_y);
}

Diamond.prototype.Touched = function(){
	if(mouse_x >= this.x && mouse_x <= this.x + this.width &&
		mouse_y >= this.y && mouse_y <= this.y + this.height){
		return true;
	}
	return false;
}

function Arrow(a, b){
	this.s1 = a;
	this.s2 = b;
	this.name = "arrow";
	this.arrow = true;
	this.value = "-";
}

function S_Arrow(a, b){//straight arrow
	this.s1 = a;
	this.s2 = b;
	this.name = "s_arrow";
	this.mode = "v";//vertical 1st
	this.arrow = true;
	this.value = '-';
}

function Td_Arrow(a, b){//top down type arrow
	this.s1 = a;
	this.s2 = b;
	this.name = "td_arrow";
	this.arrow = true;
	this.value = '-';
	
	this.base_line = 0;
	this.ox = shapes[a].x;//ox is used to detect a have change position or not
	this.user_resize = false;//check user have resize manually
}

Arrow.prototype.Draw = function(){
	var center_x1 = shapes[this.s1].x + shapes[this.s1].width/2;
	var center_y1 = shapes[this.s1].y + shapes[this.s1].height/2;
	var center_x2 = shapes[this.s2].x + shapes[this.s2].width/2;
	var center_y2 = shapes[this.s2].y + shapes[this.s2].height/2;
	
	if(this.arrow){
		//triangle
		var dx = (center_x1 + center_x2) / 2;
		var dy = (center_y1 + center_y2) / 2;
		
		if(Math.abs(center_x1-center_x2) <= Math.abs(center_y1-center_y2)){
			ctx.moveTo(dx-5, dy);
			ctx.lineTo(dx+5, dy);
			ctx.lineTo( (center_x1+center_x2*3)/4, (center_y1+center_y2*3)/4);
			ctx.lineTo(dx-5, dy);
		} else{
			ctx.moveTo(dx, dy-5);
			ctx.lineTo(dx, dy+5);
			ctx.lineTo( (center_x1+center_x2*3)/4, (center_y1+center_y2*3)/4);
			ctx.lineTo(dx, dy-5);
		}
		//ctx.fillStyle = "";
		ctx.stroke();
	}
	
	//line
	ctx.moveTo(center_x1, center_y1);
	ctx.lineTo(center_x2, center_y2);
	ctx.strokeStyle = "black";
	ctx.stroke();
}

S_Arrow.prototype.Draw = function(){
	var center_x1 = shapes[this.s1].x + shapes[this.s1].width/2;
	var center_y1 = shapes[this.s1].y + shapes[this.s1].height/2;
	var center_x2 = shapes[this.s2].x + shapes[this.s2].width/2;
	var center_y2 = shapes[this.s2].y + shapes[this.s2].height/2;
	
	//text
	if(this.mode == "v"){//vertical 1st
		if(this.value == true){
			ctx.fillStyle = "black";
			ctx.font = "10px Arial";
			ctx.fillText("TRUE", center_x1 - 50, (center_y1+center_y2) / 2);
			ctx.fillText("TRUE", (center_x1+center_x2)/2, center_y2 - 50);
		} else if(this.value == false){
			ctx.fillStyle = "black";
			ctx.font = "10px Arial";
			ctx.fillText("FALSE", center_x1 - 50, (center_y1+center_y2) / 2);
			ctx.fillText("FALSE", (center_x1+center_x2)/2, center_y2 - 50);
		}
	} else if(this.mode == "h"){//horizontal 1st
		if(this.value == true){
			ctx.fillStyle = "black";
			ctx.font = "10px Arial";
			ctx.fillText("TRUE", (center_x1+center_x2) / 2, center_y1 - 50);
			ctx.fillText("TRUE", center_x2 - 50, (center_y1+center_y2) / 2);
		} else if(this.value == false){
			ctx.fillStyle = "black";
			ctx.font = "10px Arial";
			ctx.fillText("FALSE", (center_x1+center_x2) / 2, center_y1 - 50);
			ctx.fillText("FALSE", center_x2 - 50, (center_y1+center_y2) / 2);
		}
	}
	//triangle
	if(this.arrow){
		if(this.mode == "v"){
			//vertical arrow
			ctx.moveTo( center_x1 - 5, (center_y1+center_y2) / 2);
			ctx.lineTo( center_x1 + 5, (center_y1+center_y2) / 2);
			if(center_y1 > center_y2)//direction
				ctx.lineTo( center_x1, (center_y1+center_y2) / 2 - 10);
			else
				ctx.lineTo( center_x1, (center_y1+center_y2) / 2 + 10);
			ctx.lineTo( center_x1 - 5, (center_y1+center_y2) / 2);
			ctx.stroke();
			//horizontal arrow
			ctx.moveTo( (center_x1+center_x2) / 2, center_y2 - 5);
			ctx.lineTo( (center_x1+center_x2) / 2, center_y2 + 5);
			if(center_x1 > center_x2)//direction
				ctx.lineTo( (center_x1+center_x2) / 2 - 10, center_y2);
			else 
				ctx.lineTo( (center_x1+center_x2) / 2 + 10, center_y2);
			ctx.lineTo( (center_x1+center_x2) / 2, center_y2 - 5);
			ctx.stroke();
		} else if(this.mode == "h"){
			//horizontal arrow
			ctx.moveTo( (center_x1+center_x2) / 2, center_y1 - 5);
			ctx.lineTo( (center_x1+center_x2) / 2, center_y1 + 5);
			if(center_x1 > center_x2)//direction
				ctx.lineTo( (center_x1+center_x2) / 2 - 10, center_y1);
			else 
				ctx.lineTo( (center_x1+center_x2) / 2 + 10, center_y1);
			ctx.lineTo( (center_x1+center_x2) / 2, center_y1 - 5);
			ctx.stroke();
			//vertical arrow
			ctx.moveTo( center_x2 - 5, (center_y1+center_y2) / 2);
			ctx.lineTo( center_x2 + 5, (center_y1+center_y2) / 2);
			if(center_y1 > center_y2)//direction
				ctx.lineTo( center_x2, (center_y1+center_y2) / 2 - 10);
			else
				ctx.lineTo( center_x2, (center_y1+center_y2) / 2 + 10);
			ctx.lineTo( center_x2 - 5, (center_y1+center_y2) / 2);
			ctx.stroke();
		}
	}
	//line
	ctx.moveTo(center_x1, center_y1);
	if(this.mode == "v"){
		ctx.lineTo(center_x1, center_y2);
	} else if(this.mode == "h"){
		ctx.lineTo(center_x2, center_y1);
	}
	ctx.lineTo(center_x2, center_y2);
	ctx.fillStyle= "white";
	ctx.strokeStyle = "black";
	ctx.stroke();
}

Td_Arrow.prototype.Draw = function(){
	var center_x1 = shapes[this.s1].x + shapes[this.s1].width/2;
	var center_y1 = shapes[this.s1].y + shapes[this.s1].height/2;
	var center_x2 = shapes[this.s2].x + shapes[this.s2].width/2;
	var center_y2 = shapes[this.s2].y + shapes[this.s2].height/2;
	
	//base line update
	if(this.ox != shapes[this.s1].x || !this.user_resize){
		this.ox = shapes[this.s1].x;
		this.user_resize = false;
		
		//option1(between 2 y)
		this.base_line = (center_y1 + center_y2)/2; 
		
		//option2(fixed y)
		/*if(center_y1 < center_y2)
			this.base_line = shapes[this.s1].y + shapes[this.s1].height + 100;
		else 
			this.base_line = shapes[this.s1].y - 100;*/
	}
	//arrow
	
	//line
	ctx.moveTo(center_x1, center_y1);
	ctx.lineTo(center_x1, this.base_line);
	ctx.lineTo(center_x2, this.base_line);
	ctx.lineTo(center_x2, center_y2);
	ctx.strokeStyle = "black";
	ctx.stroke();
}

Arrow.prototype.Touched = function(){
	return false;
}

S_Arrow.prototype.Touched = function(){
	return false;
}

Td_Arrow.prototype.Touched = function(){
	var center_x1 = shapes[this.s1].x + shapes[this.s1].width/2;
	var center_y1 = shapes[this.s1].y + shapes[this.s1].height/2;
	var center_x2 = shapes[this.s2].x + shapes[this.s2].width/2;
	var center_y2 = shapes[this.s2].y + shapes[this.s2].height/2;
	var left, right;
	if(center_x1 < center_x2){
		left = center_x1;
		right = center_x2;
	} else {
		left = center_x2;
		right = center_x1;
	}
	//if x is bet left and right
	if(mouse_x > left && mouse_x < right && mouse_y > this.base_line - 9 && mouse_y < this.base_line + 9){
		return true;
	}
	return false;
}

function getShape(id){
	var head_name = document.getElementById('head_name').value;
	var tail_name = document.getElementById('tail_name').value;
	var new_x = canvas.width - 120, new_y = canvas.height - 120;
	var object;
	switch(id){
		case "c1":
			object = new Circle(new_x, new_y, head_name);
			break;
		case "c2":
			object = new Circle(new_x, new_y, tail_name);
			break;
		case "o1":
			object = new Oval(new_x, new_y, head_name);
			break;
		case "o2":
			object = new Oval(new_x, new_y, tail_name);
			break;
		case "q1":
			object = new Quadrilateral(new_x, new_y, head_name);
			break;
		case "q2":
			object = new Quadrilateral(new_x, new_y, tail_name);
			break;
		case "p1":
			object = new Parallelogram(new_x, new_y, head_name);
			break;
		case "p2":
			object = new Parallelogram(new_x, new_y, tail_name);
			break;
		case "d1":
			object = new Diamond(new_x, new_y, head_name);
			break;
		case "d2":
			object = new Diamond(new_x, new_y, tail_name);
			break;
	}
	
	return object;
}

function touched_border(i){
	if(mouse_x > shapes[i].x - 9 && mouse_x < shapes[i].x + 9){
		if(mouse_y > shapes[i].y - 9 && mouse_y < shapes[i].y + 9){
			return "TL";//top left
		} else if(mouse_y > shapes[i].y - 9 + shapes[i].height && mouse_y < shapes[i].y + 9 + shapes[i].height){
			return "BL";//bottom left
		} else if(mouse_y > shapes[i].y && mouse_y < shapes[i].y + shapes[i].height){
			return "L";//left
		}
	} else if(mouse_x > shapes[i].x - 9 + shapes[i].width && mouse_x < shapes[i].x + 9 + shapes[i].width){
		if(mouse_y > shapes[i].y - 9 && mouse_y < shapes[i].y + 9){
			return "TR";//top right
		} else if(mouse_y > shapes[i].y - 9 + shapes[i].height && mouse_y < shapes[i].y + 9 + shapes[i].height){
			return "BR";//bottom right
		} else if(mouse_y > shapes[i].y && mouse_y < shapes[i].y + shapes[i].height){
			return "R";//right
		}
	} else if(mouse_x > shapes[i].x && mouse_x < shapes[i].x + shapes[i].width){
		if(mouse_y > shapes[i].y - 9 && mouse_y < shapes[i].y + 9){
			return "T";
		} else if(mouse_y > shapes[i].y - 9 + shapes[i].height && mouse_y < shapes[i].y + 9 + shapes[i].height){
			return "B";
		}
	}
	return "none";
}

function selected_effect(bool, i){
	if(bool == true){
		var fsize = shapes[i].fsize;
		shapes[i].selected = true;
		tail_coloring(i, 0);
		shapes[i].color = "blue";
		shapes[i].border = "white";
		document.getElementById('head_name').value = shapes[i].name;
		document.getElementById('head_name').focus();//not working
		if(fsize != -1)
			document.getElementById("font_size_form").value = fsize;
		else 
			document.getElementById("font_size_form").value = "";
	} else {
		shapes[i].selected = false;
		for(j in shapes){
			shapes[j].color = "white";
			shapes[j].border = "black";
		}
	}
}

function tail_coloring(s, level){
	var color_value = 255 - level*16;
	var color = "rgb("+ color_value + ",0,0)";
	var count = 0;
	while(count != shapes[s].tails.length){
		var tail = shapes[s].tails[count];
		if(shapes[tail].color == "white" && shapes[tail].border == "black"){
			shapes[tail].color = color;
			shapes[tail].border = "white";
			tail_coloring(tail, level+1);//recursion
		}
		count++;
	}
}

function update_name(id){
	var value = document.getElementById(id).value;
	if(id == 'head_name'){
		for(i in shapes){
			if(shapes[i].selected){
				shapes[i].name = value;
				break;
			}
		}
	}
}

function change_font2(){
	var size = document.getElementById("font_size_form").value;
	if(!Number(size) && size != ""){
		alert("Please enter number value.");
	} else if(size == ""){
		for(i in shapes){
			if(shapes[i].selected)
				shapes[i].fsize = -1;//auto mode
		}
	} else {
		for(i in shapes){
			if(shapes[i].selected)
				shapes[i].fsize = size;
		}
	}
}

function advance_box_init(){
	var head = -1;
	for(i in shapes){
		if(shapes[i].selected){
			head = i;
			break;
		}
	}
	var font_list = [];
	font_list.push("Andale Mono");
	font_list.push("Arial");
	font_list.push("Comic Sans MS");
	font_list.push("Courier New");
	font_list.push("Georgia");
	font_list.push("Impact");
	font_list.push("Lucida Console");
	font_list.push("Marlett");
	font_list.push("Minion Web");
	font_list.push("Times New Roman");
	font_list.push("Tahoma");
	font_list.push("Trebuchet MS");
	font_list.push("Verdana");
	var new_content = "<button id='adv_box_mini'>-</button><button onclick='close_advance_box();'>X</button>";
	new_content += "<span id='adv_repos'><b>Advance Link Box</b></span><br/>";
	
	new_content += "<div id='minimize_adv'>";//this div is for minimize/maximize purpose
	
	if(head != -1){
		new_content += "<button onclick='direct_link("+head+");'>Direct link</button>";
		new_content += "<div style='margin-left:15px;'>";
		new_content += "<input name='adv_new_line' id='adv_line_type' type='radio'>Line 90&#176; Arrow<input id='adv_arrow' type='checkbox' checked='checked'><br/>";
		new_content += "<input name='adv_new_line' id='adv_td_type' type='radio'>Top-Down";
		new_content += "</div>";
		
		new_content += "<button onclick='change_font();'>Change Font-family</button>";
		new_content += "<div style='margin-left:15px;'>";
		new_content += "<select id='new_font'>";
		new_content += "<option value='"+shapes[head].font+"'>"+shapes[head].font+"</option>";
		for(i in font_list){
			if(font_list[i] != shapes[head].font)
				new_content += "<option value='"+font_list[i]+"'>"+font_list[i]+"</option>";
		}
		new_content += "</select>";
		new_content += "</div>";
		
		new_content += "<span id='links_tog'><button onclick='show_links();'>Show Link(s)</button></span><div id='modify_links' style='margin-left:15px;'></div>";
		
		new_content += "<button onclick='delete_head();'>Delete Head</button>";
		new_content += "<div style='margin-left:15px;'>";
		new_content += "Confirm<input type='checkbox' id='delete_confirm'>";
		new_content += "</div>";
	}
	
	new_content += "</div>";
	
	document.getElementById("advance_box").innerHTML = new_content;
	
	$("#adv_box_mini").click(function(){
		$("#minimize_adv").fadeToggle();
	});
	
	//change cursor
	$("#adv_repos").hover(function(){
		document.body.style.cursor = "move";
	});
	
	$("#adv_repos").mouseout(function(){
		document.body.style.cursor = "auto";
	});
	
	//activate reposition
	$("#adv_repos").mousedown(function(e){
		drag_x = e.pageX;
		drag_y = e.pageY;
		body_x = $("#advance_box").position().left;
		body_y = $("#advance_box").position().top;
		adv_repos = true;
	});
}

function tog_adv_box(){
	if(document.getElementById('minimize_adv').innerHTML != ""){
		adv_box_record = document.getElementById('minimize_adv').innerHTML;
		document.getElementById('minimize_adv').innerHTML = "";
	} else {
		document.getElementById('minimize_adv').innerHTML = adv_box_record;
	}
}

function close_advance_box(){
	document.getElementById("advance_box").className = 'hide';
}

function direct_link(head){
	close_advance_box();
	linking = true;
	document.body.style.cursor = "crosshair";
}

function change_font(){
	var font = document.getElementById('new_font').value;
	for(i in shapes){
		if(shapes[i].selected){
			shapes[i].font = font;
			break;
		}
	}
}

function delete_head(){
	var head;
	for(i in shapes){
		if(shapes[i].selected){
			head = i;
			break;
		}
	}
	//confirmation
	if(!document.getElementById("delete_confirm").checked){
		alert("Are you sure? Please confirm.");
		return;
	}
	//delete links
	for(i in links){
		if(links[i].s1 == head || links[i].s2 == head){
			delete links[i];
		}
	}
	selected_effect(false, head);
	//delete bug replacement(temporary)
	shapes[head].x = -1000;
	shapes[head].y = -1000;
	//-------------------------------
	close_advance_box();
}

function hide_links(){
	//change button name
	document.getElementById('links_tog').innerHTML = 
		"<button onclick='show_links();'>Show Link(s)</button>";
	document.getElementById("modify_links").innerHTML = "";
}

function show_links(){
	//change button name
	document.getElementById('links_tog').innerHTML = 
		"<button onclick='hide_links();'>Hide Link(s)</button>";
	
	var head;
	var extra = true;
	for(i in shapes){
		if(shapes[i].selected){
			head = i;
			break;
		}
	}
	var new_content = "<br/>";
	
	new_content += "<table><tr/><th>No.</th><th>Tail</th><th>Type</th><th>Arrow</th><th>Value</th><th>Delete</th></tr>";
	for(i in links){
		if(links[i].s1 == head){
			var tail = shapes[links[i].s2];
			new_content += "<tr>";
			new_content += "<td>"+i+"</td>";
			new_content += "<td>"+tail.name+"</td>";
			if(links[i].name == "arrow"){
				new_content += "<td><span onclick='toggle_degree("+i+");'><img src='img/arrow.png' width='13'></span></td>";
			} else if(links[i].name == "s_arrow"){
				if(links[i].mode == 'h')
					new_content += "<td><span onclick='toggle_degree("+i+");'><img src='img/harrow.png' width='13'></span></td>";
				else 
					new_content += "<td><span onclick='toggle_degree("+i+");'><img src='img/varrow.png' width='13'></span></td>";
			} else {
				new_content += "<td><span onclick='toggle_degree("+i+");'><img src='img/tdarrow.png' width='20'></span></td>";
			}
			if(links[i].arrow){
				new_content += "<td><button onclick='toggle_arrow(this.value);' value='"+i+"'>Yes</button></td>";
			} else {
				new_content += "<td><button onclick='toggle_arrow(this.value);' value='"+i+"'>No</button></td>";
			}
			if(links[i].value == true){
				new_content += "<td><button value='"+i+"' onclick='toggle_value(this.value);'>TRUE</button></td>";
			} else if(links[i].value == false){
				new_content += "<td><button value='"+i+"' onclick='toggle_value(this.value);'>FALSE</button></td>";
			} else {
				new_content += "<td><button value='"+i+"' onclick='toggle_value(this.value)'>"+links[i].value+"</button></td>";
			}
			new_content += "<td><button onclick='delink(this.value);' value='"+i+"'>Delink</button></td>"
			new_content += "</tr>";
			extra = false;
		}
	}
	//exception
	if(extra)
		new_content += "<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
	new_content += "</table><br/>";
	document.getElementById("modify_links").innerHTML = new_content;
}

function toggle_degree(id){
	var linker;
	var head = links[id].s1;
	var tail = links[id].s2;
	if(links[id].name == "arrow"){
		linker = new S_Arrow(head, tail);
	} else if(links[id].name == "s_arrow"){
		if(links[id].mode == "v"){
			linker = new S_Arrow(head, tail);
			linker.mode = "h";
			linker.value = links[id].value;
		} else {
			linker = new Td_Arrow(head, tail);
		}
	} else {
		linker = new Arrow(head, tail);
	}
	links[id] = linker;
	//refresh
	show_links();
}

function toggle_value(id){
	if(links[id].value == true){
		links[id].value = false;
	} else if(links[id].value == false){
		links[id].value = '-';
	} else {
		links[id].value = true;
	}
	//refresh
	show_links();
}

function toggle_arrow(id){
	if(links[id].arrow){
		links[id].arrow = false;
	} else {
		links[id].arrow = true;
	}
	//refresh
	show_links();
}

function delink(id){
	var head;
	for(i in shapes){
		if(shapes[i].selected){
			head = i;
			break;
		}
	}
	
	//delete tail
	var tail = links[id].s2;
	var new_tails = [];
	for(i in shapes[head].tails){
		if(tail == shapes[head].tails[i]){
		} else {
			new_tails.push(shapes[head].tails[i]);
		}
	}
	shapes[head].tails = new_tails;
	
	//delete link
	delete links[id];
	
	//refresh
	show_links();
	selected_effect(false, head);
	selected_effect(true, head);
}