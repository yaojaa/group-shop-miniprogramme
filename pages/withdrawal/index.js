const app = getApp()
const { $Message } = require('../../iView/base/index');
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    store_money:0,
    inputMoney:0,
    withdrawalslist:[],
    totalpage:1
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.get_store_info()
    this.finance_withdrawal_list()
    
  },
  inputMoneyChange(e){
    console.log(e.detail.detail.value)
    if(e.detail.detail.value){
          this.setData({
      inputMoney:e.detail.detail.value
    })
    }

  },
  getMoney(){

    if(this.data.inputMoney){

              wx.request({
                url: 'https://www.daohangwa.com/api/seller/finance_apply_withdrawal',
                method:'post',
                data: {
                    token: app.globalData.token,
                    money:this.data.inputMoney
                },
                success: (res) => {
                    if (res.data.code == 0) {

                       $Message({
                         content:'申请提现成功，请耐心等待审核',
                         type:'success'
                      })

                    }else{

                       $Message({
                         content:res.data.msg,
                         type:'error'
                      })
                    }
                }
            })


    }

  },
  get_store_info(){

        wx.request({
            url: 'https://www.daohangwa.com/api/seller/get_store_info',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        store_money: res.data.data.store_money,
                        inputMoney:res.data.data.store_money
                    })
                }
            }
        })

        

    },
    //获取提醒记录
   finance_withdrawal_list(){

            wx.request({
            url: 'https://www.daohangwa.com/api/seller/finance_withdrawal_list',
            data: {
                token: app.globalData.token
            },
            success: (res) => {

                if (res.data.code == 0) {
     res.data.data.withdrawalslist.create_time = util.formatTime(new Date(res.data.data.withdrawalslist.create_time*1000))

                    this.setData({
                        withdrawalslist: res.data.data.withdrawalslist                      })
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