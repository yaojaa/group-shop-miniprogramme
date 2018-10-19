Page({
  data:{
    current: "tab1",
    visible: false,
    alertMsg: "确定执行？",

  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {
    //创建节点选择器
    let query = wx.createSelectorQuery();

    query.select('.line-chart').boundingClientRect( rect => {
      let size = [rect.width, rect.height - 6];

      this.createChart([
        { list: [30, 800, 160, 1000, 0, 300, 500], color: "red" },
        { list: [300, 40, 20, 80, 880, 600, 900], color: "green" }
      ], "canvas0", size);

      this.createChart([
        { list: [30, 300, 60, 800, 0, 300, 50], color: "red" },
        { list: [300, 40, 200, 80, 20, 600, 0], color: "green" }
      ], "canvas1", size);

    }).exec();



  },

  createChart(arr, id, size){
    if(!arr || arr.length == 0 || !id) return;
    let gd = wx.createCanvasContext(id);
    let maxX = 0, maxY = 0;
    let tx = 1, ty = 1;

    arr.forEach(e => {
      maxX = e.list.length > maxX ? e.list.length : maxX;
      maxY = Math.max(...e.list) > maxY ? Math.max(...e.list) : maxY;
    });

    tx = size[0]/(maxX-1);
    ty = size[1]/maxY;

    arr.forEach(e => {
      this.createLine({
        gd: gd,
        arr: e.list,
        strokeColor: e.strokeColor || e.color,
        fillColor: e.fillColor || e.strokeColor || e.color,
        size:{tx, ty, maxX, maxY}
      })
    });
    
    gd.draw();
  },

  createLine({gd, arr, strokeColor, fillColor, size}){
    if(!arr || arr.length == 0) return;
    gd.strokeStyle = strokeColor;
    gd.fillStyle = fillColor;

    arr.forEach((e,i) => {
      let x,y;
      x = i*size.tx;
      y = (size.maxY - e)*size.ty + 3;

      gd.beginPath();
      i == 0 ? gd.moveTo(x, y) : gd.moveTo((i-1)*size.tx, (size.maxY - arr[i-1])*size.ty + 3);
      gd.lineTo(x, y);
      gd.stroke();

      if(i == 0 || i == arr.length - 1) return;

      gd.beginPath();
      gd.arc(x, y, 2, 0, 2 * Math.PI, true);
      gd.fill();
    });
  },

  tapTo({target}) {
    let url = '/pages/publish/publish';
    if (target.dataset.id) url = url + '?id=' + target.dataset.id;
    wx.navigateTo({
      url: url,
    })
  },

  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  openAlert({target}) {
    console.log(target)
    this.setData({
      visible: true,
      alertMsg: `id:${target.dataset.id};type:${target.dataset.type}`
    });
  },

  closeAlert(e) {
    console.log(e)
    this.setData({
      visible: false
    });
  },


})