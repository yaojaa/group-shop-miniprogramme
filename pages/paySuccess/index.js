// pages/paySuccess/index.js
const app = getApp()
const util = require('../../utils/util')
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
        numers: '❶❶❷❸❹❺❻❼❽❾❿'.split(''),
        wordArr: {
            1: '值，躺着把钱省了',
            2: '人生太多选择题 跟着买 就对了',
            3: '错过又要等一年 该出手时就出手',
            4: '该出手时就出手',
            5: '不要睡 起来嗨',
            6: '机不可失，失不再来',
            7: '',
            8: '',
            9: ' '
        },
        order:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.order_id = options.order_id
        this.getOrderInfo();

        this.setData({
            goods_id: options.goods_id,
        })

        //开始绘制

        // util.get_painter_data_and_draw.call(this, options.goods_id, true)


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
    
    goback() {

        wx.redirectTo({
            url: '../home/index'
        })

    },
    // addListener:util.userListner,
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {

        this.setData({
            clickShare:true,
            onshare:true
        })



        let shareTitle = this.data.wordArr[this.data.create_number] || '大家再接再厉...' + this.data.goods_name
        let numberIcon = ''
        return {
            title: '',
            path: '/pages/goods/goods?goods_id=' + this.data.goods_id
        }
    },
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