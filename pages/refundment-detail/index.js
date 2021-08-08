const util = require('../../utils/util')
import Dialog from '../../vant/dialog/dialog';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
         wx.showLoading()

        if(options.id){
            this.id = options.id
            this.getDetail()
        }

           if(options.order_id){
            this.order_id = options.order_id
            this.getOrderdetail()
        }

    },

    getOrderdetail(){
        util.wx.get('/api/user/get_order_detail?order_id='+this.order_id)
        .then(res=>{
            this.setData({
                order_detail:res.data.data,
                refund_fee:res.data.data.order_detail[0].total_price
            })

            wx.hideLoading()


        })
    },

    getDetail(){


        util.wx.get('/api/user/order_refund_detail?order_refund_id='+this.id)
        .then(res=>{
            this.setData({
                detail:res.data.data
            })
        })

                wx.hideLoading()

    },

    cancel(){

        Dialog.confirm({
          title: '撤销退款申请',
          message: '注意：撤销后无法继续申请退款',
          asyncClose: true
        })
          .then(() => {

        util.wx.post('/api/user/order_refund_revoke',{
            order_refund_id:this.id
        }).then(res=>{
            this.getDetail()
             wx.showToast({
                title:'撤销成功',
                icon:'none'
            })
            Dialog.close();

            wx.redirectTo({
              url:'../order-list/index'
            })

        },res=>{
            wx.showToast({
                title:res.data.msg,
                icon:'none'
            })
                          Dialog.close();

        })

          })
          .catch(() => {
            Dialog.close();
          });



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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})