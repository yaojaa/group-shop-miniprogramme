const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    give_type:1,//送货方式
    nickName:'',
    pay: [{
      id: 1,
      name: '在线支付',
    }, {
      id: 2,
      name: '货到付款'
    }],
    current: '在线支付',
    position: 'right',
  },
  handleChange1({ detail }) {
    this.setData({
      num: detail.value
    })
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
      current: detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      nickName: app.globalData.userInfo.nickName
    });

    console.log(app.globalData.userInfo)

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})