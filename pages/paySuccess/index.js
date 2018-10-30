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
        imagePath: "",
        goods_id: "",
        create_number: 1,
        painterData: {},
        wordArr: [
            '一马当先，英勇参团',
            '好事成双，从此生活不悲凉',
            '三人行有师傅，无人行没准儿有亲属',
            '但愿人长久 千里共拼团',
            '拼一个最爱的宝贝儿，来告别单身'
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.order_id = options.order_id
        this.getOrderInfo();

        this.setData({
            goods_id: options.goods_id
        })

        //开始绘制

        util.get_painter_data_and_draw.call(this, options.goods_id)


    },
    onImgOk(e) {

        console.log('成功后返回的', e)
        this.setData({
            imagePath: e.detail.path
        })

    },
    getOrderInfo() {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_order_detail',
            data: {
                token: app.globalData.token,
                order_id: this.data.order_id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        orders_info: res.data.data.order,
                        order_goods: res.data.data.order_goods,
                        create_number: res.data.data.order.create_number,
                        order_time: this.timetrans(res.data.data.order.add_time)
                    })
                }
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
    onShareAppMessage: function(res) {
        let shareTitle = this.data.wordArr[this.data.create_number] || ''
        // if (res.from === 'button') {
        //   // 来自页面内转发按钮
        //   console.log(res.target)
        // }
        return {
            title: '「No.' + this.data.create_number + '」' + app.globalData.userInfo.nickname + '刚刚成功参团 '+ shareTitle,
            imageUrl: this.data.imagePath,
            path: '/pages/goods/goods?goods_id=' + this.data.goods_id,
            complete(){
                console.log('ok')
                wx.navigateTo({
                    url: '../pages/home/index'
                })
            }
        }
    }
})