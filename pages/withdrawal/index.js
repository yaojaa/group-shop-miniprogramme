const app = getApp()
const util = require('../../utils/util')
import Dialog from '../../vant/dialog/dialog'

Page({

    /**
     * 页面的初始数据
     */
    data: {

        pending_money: ' ...',
        inputMoney: '',
        withdrawalslist: [],
        totalpage: 1,
        store_money:'*',
        showDialog:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.get_store_info()
        this.finance_withdrawal_list()
        this.checkUinfo()

    },
    checkUinfo(){
     util.wx.get('/api/user/user_info').then((res)=>{
      if(res.data.data.mobile=='' || res.data.data.wechatnumber=='' ){

        wx.showModal({
         title: '请先完善联系方式',
         content: '完善后即可提现 方便粉丝联系',
         showCancel: false,//是否显示取消按钮
         confirmText:"去设置",//默认是“确定”
         success: function (res) {
            wx.navigateTo({
              url:'../identify/identify'
            })
         },
         fail: function (res) { },//接口调用失败的回调函数
         complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })

       
      }
    })
    },
    inputMoneyChange(e) {
        if (e.detail.value) {
            this.setData({
                inputMoney: e.detail.value
            })
        }

    },
    getMoney() {


      // if(this.data.inputMoney<1){
      //   return wx.showToast({
      //     title:'至少提现1元',
      //     icon:'none'
      //   })
      // }



      // return console.log(typeof this.data.inputMoney)



      //   if (this.data.inputMoney=='') {
      //      return  wx.showToast({
      //                   title: '请输入提现金额',
      //                   icon:'none'
      //               })

      //   }



          wx.showLoading()

            util.wx.post('/api/seller/apply_withdraw', {
                apply_money: this.data.inputMoney
            }).then((res) => {

                if(res.data.code == 200){

                     Dialog.alert({
                        selector: '#dialog-success',
                        confirmButtonText: '好的'
                    }).then(() => {

                    })

                    this.setData({
                    inputMoney:'' 
                   })

                   wx.hideLoading()
                    this.finance_withdrawal_list()
                    this.get_store_info()

                }else{

                    wx.hideLoading()
                      wx.showToast({
                                title: res.data.msg,
                                icon:'none',
                                duration:5000
                            })

                }

               
                
            })
       

    },
    get_store_info() {

        util.wx.get('/api/seller/get_store_money')
            .then(res => {
                if (res.data.code == 200) {
                    this.setData({
                        pending_money: res.data.data.pending_money,
                        inputMoney:res.data.data.pending_money,
                        store_money:res.data.data.store_money
                    })
                }

            })



    },
    //获取提醒记录
    finance_withdrawal_list() {

      util.wx.get('/api/seller/withdraw_list')
      .then(res=>{

        if (res.data.code == 200) {

                    this.setData({
                        withdrawalslist: res.data.data.withdraw_list
                    })
                }



      })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    }
})