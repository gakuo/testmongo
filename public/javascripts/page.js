
$(function() {
	var main = new Page();
	main.init();
	main.updateImg(main.imgnum);
	main.render(main.ctx,main.imgR,main.imgL);
	
	$('#next').click(function () {
       main.next();
           });
	$('#back').click(function () {
       main.back();
    });
	$('canvas').mousedown(function(e) {
		main.draw(e);
		this.startX = e.pageX - $('canvas').offset().left - 5;
        this.startY = e.pageY - $('canvas').offset().top - 5;
		var datax =this.startX;
		var datay =this.startY;
		console.log(datax);
		console.log(datay);


var socket = io.connect('http://localhost'); // 1
var log = function(e){ console.log(e); }
/*socket.on('connect', function() { // 2
  log('connected');
 });
socket.emit('msg send', datax); // 3
  socket.on('msg push', function (msg) { // 7
    log('どないや'); // 8
  });*/
		//$('#list').prepend($('<div/>').text(datax));
		$.get('/click',{'x':datax,'y':datay});
    });
	$('li').click(function() {
       main.ctx.fillStyle = $(this).css('background-color');        
  //             context.strokeStyle = $(this).css('background-color');
    });
	})
	
	
var Page = function () {
};

Page.prototype.execPost = function(action, data) {
 // フォームの生成
 console.log(data);
 var form = document.createElement("form");
 form.setAttribute("action", action);
 form.setAttribute("method", "get");
 form.style.display = "none";
 document.body.appendChild(form);
 // パラメタの設定
 if (data !== undefined) {
  for (var paramName in data) {
   var input = document.createElement('input');
   input.setAttribute('type', 'hidden');
   input.setAttribute('name', paramName);
   input.setAttribute('value', data[paramName]);
   form.appendChild(input);
  }
 }
 // submit
 form.submit();
};
Page.prototype.init = function(){
    this.offset = 5;
    this.startX;
    this.startY;
    this.imgnum =6;
    this.imgL = new Image();;
    this.imgR = new Image();
    this.flag = false;
	this.canvas = $('canvas').get(0);
    if (this.canvas.getContext) {
		this.ctx = this.canvas.getContext('2d');
    }

   this.ctx.fillStyle ='rgba(0,0,0,0.3)';

};

Page.prototype.updateImg = function (newimgnum) {
	// imgnumを更新
	this.imgnum = newimgnum;
	this.imgR.src ="images/"+ this.imgnum + ".jpg?" + new Date().getTime();
    this.imgL.src ="images/"+ (this.imgnum+1) + ".jpg?" + new Date().getTime();
};

Page.prototype.render = function (context,imgr,imgl) {
	// 実際に画面に出力
	
	//alert(context);
    imgr.onload = function(){
    context.drawImage(imgr, 516, 0,516,729);
    };
   imgl.onload = function(){
    context.drawImage(imgl, 0, 0,516,729);
    };
};

Page.prototype.next = function () {
	if(this.imgnum<46){
	this.ctx.clearRect(0, 0, $('canvas').width(), $('canvas').height());
	this.imgnum = this.imgnum + 2;
	this.updateImg(this.imgnum);
	this.render(this.ctx,this.imgR,this.imgL);
	}
	};
Page.prototype.back = function () {
	if(this.imgnum>6){
	this.ctx.clearRect(0, 0, $('canvas').width(), $('canvas').height());
	this.imgnum = this.imgnum - 2;
	this.updateImg(this.imgnum);
	this.render(this.ctx,this.imgR,this.imgL);
	}
	};
Page.prototype.draw = function(e){
        this.flag = true;
        this.startX = e.pageX - $('canvas').offset().left - this.offset;
        this.startY = e.pageY - $('canvas').offset().top - this.offset;
        this.ctx.beginPath();
        this.ctx.arc(this.startX,this.startY,10,0, Math.PI*2,true);
		//context.stroke();
		this.ctx.fill();

        return false; // for chrome
    };
