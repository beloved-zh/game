var can;
var cxt;
//计时器
var time;
//定义随机食物颜色的坐标
var idx;
var gridSize=30;//格子大小
var rows = 20;//行数
var cols = 20;//列数
//定义🐍对象
var snake;
//定义食物对象
var food = {
	x : 300,
	y : 300,
	color : ['yellow','aqua','blue','blueviolet','chartreuse','darkgray','hotpink'],
};


/**
 * 画棋盘
 */
function map() {
	can = document.getElementById('can');

	cxt = can.getContext("2d");
	
	for(var i = 0; i <= gridSize*rows; i += gridSize) {
		//画横线
		cxt.beginPath();

		cxt.moveTo(0, i);

		cxt.lineTo(gridSize*rows, i);

		//cxt.strokeStyle = "aqua";

		cxt.stroke();
		//画竖线				
		cxt.beginPath();

		cxt.moveTo(i, 0);

		cxt.lineTo(i, gridSize*rows);

		//cxt.strokeStyle = "aqua";

		cxt.stroke();

	}
	//边缘
//		cxt.beginPath();
//		cxt.rect(0, 0, 800, 800);
//		cxt.strokeStyle = "red";	
//		cxt.stroke();
//		
}

/**
 * 随机食物
 * 先随机1~16
 * 单个格子50，所以*50
 * 判断随机食物，不能在🐍身上
 */
function drawFood() {
	food.x = x = Math.floor(Math.random() * rows) * gridSize;
	food.y = y = Math.floor(Math.random() * cols) * gridSize;
	console.log("foodX:"+x);
	console.log("foodY:"+y);
	//判断食物与头部
	if (x == snake.head.x && y == snake.head.y) {
		drawFood();
	}
	//判断食物与身体
	for(var i = 0 ; i < snake.body.length ; i++){
		if (x == snake.body[i].x && y == snake.body[i].y) {
			drawFood();
		}
	}
	cxt.beginPath();
	//画矩形	参数：x,y(起始坐标)，大小
	cxt.rect(x, y, gridSize, gridSize);
	//填充颜色
	//随机颜色坐标
	idx = Math.floor(Math.random() * food.color.length);
	cxt.fillStyle = food.color[idx]; //设置填充颜色
	cxt.fill(); //填充刚才绘制的区域
	cxt.stroke();
}

/**
 * 初始化🐍对象
 */
function initSnake(){
	snake = {
		head : { x : gridSize * 3, y : 0 },//头部
		body : [{ x : gridSize * 2, y : 0 },{ x : gridSize * 1, y : 0 },{ x : 0, y : 0 }],//身体
		length : 4,//长度
		speed : 100,//速度
		direction: "right",//方向
		bodyColor: "aqua",
	}
}
/**
 * 画🐍
 */
function drawSnake() {
	//画头部
	cxt.beginPath();
	cxt.rect(snake.head.x, snake.head.y, gridSize, gridSize);
	cxt.fillStyle = "red"; //设置填充颜色
	cxt.fill(); //填充刚才绘制的区域
	cxt.stroke();
	
	//画身体
	for(var i = 0 ; i < snake.body.length ; i++){
		cxt.beginPath();
		cxt.rect(snake.body[i].x,snake.body[i].y, gridSize, gridSize);
		cxt.fillStyle = snake.bodyColor; //设置填充颜色
		cxt.fill(); //填充刚才绘制的区域
		cxt.stroke();
	}
}


/**
 * 键盘判断方向
 * 防止发生🐍倒车，后退，每个需要判断
 * 键盘按下的方向要与已知头部的相反
 */
window.onkeydown = function(){
	switch (event.keyCode){
		case 37:
			if (snake.direction != "right") {
				snake.direction = "left";
			}
			break;
		case 38:
			if (snake.direction != "down") {
				snake.direction = "up";
			}
			break;
		case 39:
			if (snake.direction != "left") {
				snake.direction = "right";
			}
			break;
		case 40:
			if (snake.direction != "up") {
				snake.direction = "down";
			}
			break;
//		case 16://Shift 加速
//				clearInterval(time);
//				
//				snake.speed = 60;
//				timeShift = setInterval(function(){
//					moveSnake();
//				},snake.speed);
//				clearInterval(timeShift);
//			break;
		default:
			break;
	}
	
}

//window.onkeyup = function(){
//	if (event.keyCode == 16) {
//		clearInterval(timeShift);
//		snake.speed = 100;
//		time = setInterval(function(){
//				moveSnake();
//		},snake.speed);
//	}
//	
//}

/**
 * 控制🐍
 */
function moveSnake(){
	//清除身体的最后一格
	var x = snake.body[snake.body.length-1].x;
	var y = snake.body[snake.body.length-1].y;
	console.log("x:"+x);
	console.log("y:"+y);
	cxt.beginPath();
	cxt.rect(x, y, gridSize, gridSize);
	cxt.fillStyle = "white"; //设置填充颜色
	cxt.fill(); //填充刚才绘制的区域
	cxt.stroke();
	
	/**
	 * 改变身体
	 * 遍历数组，吧前一个赋值给后一个，再把头赋给身体的第一个
	 */
	for(var i = snake.body.length - 1 ; i > 0 ; i--){
		snake.body[i].x = snake.body[i-1].x;
		snake.body[i].y = snake.body[i-1].y;
	}
	snake.body[0].x = snake.head.x;
	snake.body[0].y = snake.head.y;
	
	
	/**
	 * 判断方向，改变头部
	 */
	switch (snake.direction){
		case "left":
			snake.head.x -= gridSize;
			break;
		case "up":
			snake.head.y -= gridSize;
			break;
		case "right":
			snake.head.x += gridSize;
			break;
		case "down":
			snake.head.y += gridSize;
			break;
		default:
			break;
	}
	gameOver();
	noclip();
	drawSnake();
	//判断是否吃到食物
	if (eatFoot()) {
		//将食物颜色赋给🐍身体
		snake.bodyColor = food.color[idx];
		drawFood();
	}
}


/**
 * 穿墙
 */
function noclip(){
	var headX = snake.head.x;
	var headY = snake.head.y;
	if(headX >= gridSize*rows){
		snake.head.x = 0;
	}
	if(headX < 0){
		snake.head.x = gridSize*(rows-1);
	}
	if(headY >= gridSize*cols){
		snake.head.y = 0;
	}
	if(headY < 0){
		snake.head.y = gridSize*(cols-1);
	}
}



/**
 * 判断是否吃到食物
 */
function eatFoot(){
	if (snake.head.x == food.x && snake.head.y == food.y) {
		snake.body[snake.body.length] = {x : food.x , y : food.y};
		snake.length++;
		return true;
	}
	return false;
}

/**
 * 判断游戏是否结束
 */
function gameOver(){
	var headX = snake.head.x;
	var headY = snake.head.y;
	//判断是否出界
//	if(headX < 0 || headX >= gridSize*rows || headY < 0 || headY >= gridSize*rows){
//		alert("over！\n分数"+snake.length);
//		//alert(snake.speed);
//		clearInterval(time);
////		alert("headX:"+headX+"headY:"+headY);
//		window.location.reload(); 
//	}
	/**
	 * 判断是否碰到身体
	 * 当头部与身体有重合的时候就结束
	 */
	for(var i = 0 ; i < snake.body.length ; i++){
		if(headX == snake.body[i].x && headY == snake.body[i].y){
			alert("over！\n分数"+snake.length);
//			alert(gridSize);
//			alert("headX:"+headX+"headY:"+headY);
			clearInterval(time);
			window.location.reload(); 
		}
	}
}

// 根据浏览器窗口大小调整HTML元素大小
function resizeHTML(){
	//浏览器文档区域大小
	var width = Math.min(window.innerWidth,window.innerHeight);
	//设置地图大小
	var div = document.getElementById('map');
	div.style.width = width*0.6 + 'px';
	div.style.height = width*0.6 + 'px';
	
	//调整can大小
	var can = document.getElementById('can');
	can.width = width * 0.6;
	can.height = width * 0.6;
	//改变格子大小
	gridSize = Math.floor(can.width / cols);
	initSnake();
}

/**
 * 控制
 * 开始/结束
 */
function control(){
	var b1 = document.getElementById('b1').innerHTML;
	if (b1 == "开始") {
		document.getElementById('b1').innerHTML = "暂停";
		time = setInterval(function(){
			moveSnake();
		},snake.speed);
		
	}
	if (b1 == "暂停") {
		document.getElementById('b1').innerHTML = "开始";
		clearInterval(time);
	}
}

/**
 * 屏幕控制方向
 */
function pmkz(data) {
	if (snake.direction == 'up' && data != 'down') {
		snake.direction = data;
	}
	if (snake.direction == 'down' && data != 'up') {
		snake.direction = data;
	}
	if (snake.direction == 'right' && data != 'left') {
		snake.direction = data;
	}
	if (snake.direction == 'left' && data != 'right') {
		snake.direction = data;
	}
	// alert(snake.direction);
	// if (data != snake.direction) {
	// 	snake.direction = data;
	// }
}

/**
 * 加速
 */
function addSpeed(){
	clearInterval(time);
	snake.speed -= 20;
	time = setInterval(function(){
			moveSnake();
	},snake.speed);
}

/**
 * 减速
 */
function minusSpeed(){
	clearInterval(time);
	snake.speed += 20;
	time = setInterval(function(){
			moveSnake();
	},snake.speed);
}

window.onload = function() {
	resizeHTML();
	
	map();

	drawFood();
	
	drawSnake();
	
	console.log("headX:"+snake.head.x+"headY:"+snake.head.y);
	
}
	
//当浏览器大小改变的时候触发
window.onresize = function(){
	resizeHTML();
	
	map();
	
	drawFood();
	
	drawSnake();
}



