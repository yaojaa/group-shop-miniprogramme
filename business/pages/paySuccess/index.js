// pages/paySuccess/index.js
const app = getApp()
const util = require('../../../utils/util')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        share: false,
        onshare:false,
        avatar: '',
        order_id: '',
        ordersInfo: '',
        order_goods: '',
        order_time: '',
        wx_collection_code: '',
        goods_id: "",
        create_number: 54,
        clickShare:false,
        qty:1,
        order:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.order_id = options.order_id
        this.getOrderInfo();

        this.data.goods_id = options.goods_id
    },
    // onImgOk(e) {

    //     this.setData({
    //         imagePath: e.detail.path
    //     })

    // },
    // imgPreview: function(event) {
    //     console.log(event.currentTarget.dataset)
    //     var src = event.currentTarget.dataset.url; //获取data-src
    //     //图片预览
    //     wx.previewImage({
    //         current: src, // 当前显示图片的http链接
    //         urls: [src] // 需要预览的图片http链接列表
    //     })
    // },
    getOrderInfo() {

        wx.showLoading()

        util.wx.get('/api/user/get_order_detail', {
            order_id: this.data.order_id

        }).then(res => {

                    wx.hideLoading()


            if (res.data.code == 200) {

                //订购数量
                var qty = 0;
                 res.data.data.order_detail.forEach(item=>{
                    qty+= item.qty
                 })
                
                this.setData({
                    order: res.data.data,
                    create_number: res.data.data.create_number,
                    goods_name: res.data.data.order_detail[0].goods_name,
                    order_time: res.data.data.addtime,
                    qty:qty
                })
            }
        }).catch(e=>{
           wx.hideLoading()

           wx.showToast({
            title:e.data.msg,
            icon:'none'
           })

        })

    },
    timetrans(date) {
        var date = new Date(date * 1000); //如果date为10位不需要乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    },

    goback(){

      wx.navigateBack()

    },
    
    goHome() {

        wx.redirectTo({
            url: '../home/index'
        })

    },
    // addListener:util.userListner,
    /**
     * 用户点击右上角分享
     */

    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    },
    addListener:function () {
          wx.requestSubscribeMessage({
              tmplIds: ['17y_mLplxTn0resiR34oUsJMZu2E2W6i0x2YIRZgvZ4','Wu_vie78kgoRr8y90IAsxoEn87BJ3nDrEBLP0MK6208'],
              success (res) { }
            })
    }
})