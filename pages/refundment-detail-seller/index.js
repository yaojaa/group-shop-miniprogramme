const util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {

        order_detail:{},
        detail:{},
        refund_fee:'',
        refund_desc:'',
        real_refund_fee:'',
        radio_status:"4", //同意拒绝状态
        status:''
    
    },
   onChange(event) {
    this.setData({
      radio_status: event.detail
    });
  },

  feeChange(event){

    this.setData({
      refund_fee: event.detail
    });
  },

   refundDescChange(event){

    this.setData({
      refund_desc: event.detail
    });
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
        util.wx.get('/api/seller/get_order_detail?order_id='+this.order_id)
        .then(res=>{
            this.setData({
                order_detail:res.data.data[0],
                refund_fee:res.data.data[0].order_detail[0].total_price
            })
        })
    },

    getDetail(){

        util.wx.get('/api/seller/order_refund_detail?order_refund_id='+this.id)
        .then(res=>{
            this.setData({
                detail:res.data.data,
                real_refund_fee:res.data.data.refund_fee,
                status:res.data.data.status
            })
        })
    },

    submit(){
        util.wx.post('/api/seller/order_refund_audit',{
              order_refund_id:this.id,// 退款记录的主键（记录列表里有返回）
                       status:this.data.radio_status,// 审核结果（3:拒绝, 4:通过）
                  refund_desc:this.data.refund_desc,// 审核原因
                 real_refund_fee:this.data.real_refund_fee //真是退款金额
        }).then(res=>{
            wx.showToast({
                title:'操作成功',
                icon:'none'
            })
            this.getDetail()
        },res=>{
            wx.showToast({
                title:res.data.msg,
                icon:'none'

            })
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})