// pages/paySuccess/index.js
const app = getApp()
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        share: false,
        avatar: '',
        order_id: '',
        ordersInfo: '',
        order_goods: '',
        order_time: '',
        wx_collection_code: '',
        imagePath: "",
        goods_id: "",
        create_number: 54,
        painterData: {},
        numers: '❶❶❷❸❹❺❻❼❽❾❿'.split(''),
        wordArr: {
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: '',
            8: '',
            9: ' ',
            11: '',
            12: '',
            13: ''
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
                // var order = res.data.data;
                // this.setData({
                //     orders_info: order.order,
                //     goods_name: order.goods.goods_name,
                //     order_goods: order.order_goods,
                //     create_number: order.order.create_number,
                //     wx_collection_code: order.store.wx_collection_code,
                //     order_time: this.timetrans(order.order.add_time)
                // })
                this.setData({
                    order: res.data.data,
                    create_number: res.data.data.create_number,
                    goods_name: res.data.data.order_detail[0].goods_name,
                    order_time: res.data.data.addtime
                })
            }
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        let shareTitle = this.data.wordArr[this.data.create_number] || '大家再接再厉...' + this.data.goods_name
        let numberIcon = this.data.create_number <= 10 ? this.data.numers[this.data.create_number] : '「No.' + this.data.create_number + '」'
        return {
            title: numberIcon + app.globalData.userInfo.nickname + '成功参团👍' + shareTitle,
            imageUrl: this.data.imagePath,
            path: '/pages/goods/goods?goods_id=' + this.data.goods_id,
            complete() {
                console.log('ok')
                wx.navigateTo({
                    url: '../pages/home/index'
                })
            }
        }
    },
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    }
})