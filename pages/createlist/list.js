Page({
  data:{
    
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {
    //创建节点选择器
    let query = wx.createSelectorQuery();

    query.select('.line-chart').boundingClientRect( rect => {

      this.createChart([
        { list: [[30, 20], [100, 30], [160, 16], [1000, 1]], color: "red" },
        { list: [[10, 10], [80, 2], [120, 30], [680, 10]], color: "green" }
      ], "canvas0", [rect.width-6, rect.height-6]);

      this.createChart([
        { list: [[30, 20], [100, 16], [360, 30], [80, 10]], color: "red" },
        { list: [[10, 10], [80, 2], [120, 30], [180, 20]], color: "blue" }
      ], "canvas1", [rect.width-6, rect.height-6]);

    }).exec();



  },

  createChart(arr, id, size){
  	if(!arr || arr.length == 0) return;
  	let gd = wx.createCanvasContext(id);
    let x = 0, y = 0;
    let tx = 1, ty = 1;
    arr.forEach(e => {
      e.list.forEach(ee => {
        x = ee[0] > x ? ee[0] : x;
        y = ee[1] > y ? ee[1] : y;
      })
    });

    tx = size[0]/x;
    ty = size[1]/y;

    arr.forEach(e => {
      this.createLine({
        gd: gd,
        arr: e.list,
        strokeColor: e.strokeColor || e.color,
        fillColor: e.fillColor || e.strokeColor || e.color,
        size:[tx, ty]
      })
    });
    
    gd.draw();
  },
  createLine({gd, arr, strokeColor, fillColor, size}){
  	if(!arr || arr.length == 0) return;
  	gd.strokeStyle = strokeColor;
	  gd.fillStyle = fillColor;

  	arr.forEach((e,i) => {
      gd.beginPath();
      e[0] = e[0]*size[0] + 3;
      e[1] = e[1]*size[1] + 3;
      i == 0 ? gd.moveTo(0, 0) : gd.moveTo(arr[i-1][0], arr[i-1][1]);
      gd.lineTo(e[0], e[1]);
      gd.stroke();

      gd.beginPath();
      gd.arc(e[0], e[1], 2, 0, 2 * Math.PI, true);
      gd.fill();
  	});
  },
  tapTo() {
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },


})