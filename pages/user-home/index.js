const app = getApp()
const util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        goodslist: [],
        goods_id: "",
        order_id: "",
        link_url: "",
        is_loading: true,
        scrollTop: 0,
        store_money: "",
        pending_money: '***',
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        show_tips: false,
        orderList: [],
        isCustome: true
    },
    closleTips() {
        this.setData({
            show_tips: false
        })
        wx.setStorage({
            key: 'show_tips',
            data: 'x'
        })
    },

    toDetail(e) {
        let postId = e.currentTarget.dataset.id || e.target.dataset.id
        wx.navigateTo({
            url: '../goods/goods?goods_id=' + postId
        })
    },

    getProList() {
        util.wx.get('/api/user/get_bought_store_goods').then(res => {
            if (res.data.code == 200) {
                this.setData({
                    proList: res.data.data.goods,
                    is_loading: false
                })
            } else {
                wx.clearStorageSync()
                app.globalData.userInfo = null
                app.redirectToLogin()
            }
        })
    },

    goSupperReg() {
        wx.navigateTo({
            url: '/business/pages/create-home/index'
        })

    },

    goPublish() {
        wx.navigateTo({
            url: '../create-home/index'
        })

    },

    reGetUserInfo() {

        util.wx.get('/api/user/get_user_info').then(res => {
            if (res.data.code == 200) {
                const d = res.data.data


                var userInfo = d.user

                if (d.hasOwnProperty('store')) {
                    userInfo.store = d.store
                }

                if (d.hasOwnProperty('supplier')) {
                    userInfo.supplier = d.supplier
                }

                app.globalData.token = userInfo.token
                app.globalData.userInfo = userInfo

                wx.setStorage({ //存储到本地
                    key: "userInfo",
                    data: userInfo
                })

                if (d.store) {

                    wx.redirectTo({
                        url: '../home/index'
                    })
                }


            }
        })

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {


        if (typeof app.globalData.userInfo == 'undefined' || app.globalData.userInfo == null) {
            app.redirectToLogin()

            return
        } else {

            this.setData({
                userInfo: app.globalData.userInfo
            })

        }

        wx.hideHomeButton()


        // this.reGetUserInfo()

        this.getProList()
    },
    getOrderCount() {
        util.wx.get('/api/user/get_order_count_groupby_static').then(res => {
            if (res.data.code == 200) {
                this.setData({
                    waitpay: res.data.data.waitpay,
                    waitreceived: res.data.data.waitreceived,
                    complete: res.data.data.complete
                })
            }
        })
    }
})