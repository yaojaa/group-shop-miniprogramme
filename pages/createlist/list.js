Page({
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {

	this.createChart([
		{list:[[30,20],[100,30],[160,16],[200,1]],color:"red"},
		{list:[[10,10],[80,2],[120,30],[180,10]],color:"yellow"}
	], "canvas0");

	this.createChart([
		{list:[[30,20],[100,16],[160,16],[200,16]],color:"red"},
		{list:[[10,10],[80,2],[120,30],[180,20]],color:"yellow"}
	], "canvas1");


  },

  createChart(arr, id){
  	if(!arr || arr.length == 0) return;
  	let gd = wx.createCanvasContext(id);
	arr.forEach(e => {
		this.createLine({
			gd: gd,
			arr: e.list,
			strokeColor: e.strokeColor || e.color, 
			fillColor: e.fillColor || e.strokeColor || e.color
		})
	});  	

	gd.draw();
  },
  createLine({gd, arr, strokeColor, fillColor}){
  	if(!arr || arr.length == 0) return;
  	gd.strokeStyle = strokeColor;
	gd.fillStyle = fillColor;

  	arr.forEach((e,i) => {
		gd.beginPath();
		i == 0 ? gd.moveTo(0, 0) : gd.moveTo(arr[i-1][0], arr[i-1][1]);
		gd.lineTo(e[0], e[1]);
		gd.stroke();

		gd.beginPath();
		gd.arc(e[0], e[1], 3, 0, 2 * Math.PI, true);
		gd.fill();
  	});
  }


})