const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    store_money:0,
    inputMoney:0
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.get_store_info()
    
  },
  inputMoney(e){
    this.setData({
      inputMoney:e.detail.value
    })
  },
  getMoney(){

    if(this.data.inputMoney){

              wx.request({
                url: 'https://www.daohangwa.com/api/seller/finance_apply_withdrawal',
                data: {
                    token: app.gloablData.token,
                    inputMoney:this.data.inputMoney
                },
                success: (res) => {
                    if (res.data.code == 0) {
                   
                    }
                }
            })


    }

  },
  get_store_info(){

        wx.request({
            url: 'https://www.daohangwa.com/api/seller/get_store_info',
            data: {
                token: app.gloablData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        store_money: res.data.data.store_money
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