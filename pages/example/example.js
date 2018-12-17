import shareCard from '../../palette/shareCard';

Page({
  imagePath: '',

  /**
   * 页面的初始数据
   */
  data: {
    template: {},
    shareCardConfig: {},
  },

  onImgOK(e) {
    this.imagePath = e.detail.path;
    console.log(e);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var obj = wx.createSelectorQuery();
    obj.selectAll('.des-content').boundingClientRect();
    obj.exec(function (rects) {
      rects = rects[0];
      console.log(rects)
      console.log(rects.length)
      rects.forEach(e => {
        console.log(Math.ceil(e.width))
        console.log(Math.ceil(e.height))
        console.log('line', Math.ceil(e.height/60*670/e.width))
      })
    });
    this.setData({
      template: new shareCard().palette(),
    });
  },
});
