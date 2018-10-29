Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    markers: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    wx.request({
      url: 'https://www.daohangwa.com/api/goods/get_goods_info',
      data: {
        // token :app.globalData.token,
        goods_id: option.id
      },
      success: (res) => {
        if (res.data.code == 0) {
          let adr = res.data.data.sell_address[0]
          this.setData({
            address: adr,
            markers: [{
              id: adr.goods_id,
              latitude: adr.latitude,
              longitude: adr.longitude,
              title: adr.name
            }]
          })

        }
      }
    })
    
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