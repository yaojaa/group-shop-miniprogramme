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
        scrollTop: 0,
        store_money: "",
        pending_money: '***',
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        show_tips: false,
        fansNum: '...',
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
                    proList: res.data.data.goods
                })
            }
            this.setData({
                isloading: false
            })
        })
    },

    onshow() {
        wx.hideHomeButton();

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideHomeButton()

        console.log('onLoad.....')

        if (typeof app.globalData.userInfo == 'undefined' || app.globalData.userInfo == null) {
            app.redirectToLogin()

            return
        } else {

            this.setData({
                userInfo: app.globalData.userInfo
            })

            if(!!app.globalData.userInfo.supplier){
                this.setData({
                    is_supperlier:true
                })
            }
           
        }

        this.get_store_info()
    this.getTabBar().init()


    },
    goCreate() {
        wx.redirectTo({
            url: '../create_shop/index'
        })
    },

    goOrders() {
        wx.redirectTo({
            url: '../new-order-list/index'
        })
    },

    goHome() {

        wx.redirectTo({
            url: '../userhome/index'
        })


    },

    get_store_info() {
        util.wx.get('/api/seller/get_store_money').then(res => {
            this.setData({
                pending_money: res.data.data.pending_money,
                fansNum :res.data.data.fans_count ,
                isCustome:res.data.data.income > 0?false:true
            })    
        })



    },

    ///////////
    //获取最新订单 //
    ///////////
    ///
    getOrderList() {

        util.wx.get('/api/seller/get_order_list', {
                // orderdate: 1,
                order_status: 1,
                pagesize: 20
            })
            .then(res => {

                if (res.data.code == 200) {

                    this.setData({
                        orderList: res.data.data.order_list
                    })
                }
            })
    },

    managePage(e) {
        let id = e.currentTarget.dataset.id
        let delivery_method = e.currentTarget.dataset.delivery_method
        let goods_name = e.currentTarget.dataset.name.slice(0, 10)

        wx.navigateTo({
            url: '../ordermanage/list?id=' + id + '&delivery_method=' + delivery_method + '&goods_name=' + goods_name
        })

    },
    addListen:util.sellerListner,

    new_btn: function() {
        wx.navigateTo({
            url: '../withdrawal/index'
        })
    },
    fansPage() {
        wx.navigateTo({
            url: '../fans/index'
        })
    },
    goSite() {
        wx.navigateTo({
            url: '../userhome/index?id=' + this.data.userInfo.store.store_id
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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


    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    },
    onShareAppMessage: function(e) {
        if (app.globalData.userInfo) {
            var _uid = app.globalData.userInfo.user_id
        }

        return {
            title: app.globalData.userInfo.nickname + '推荐您一个接单好助手',
            imageUrl: 'https://static.kaixinmatuan.cn/static/share-cover.jpg',
            path: 'pages/login/login' + '?from_id=' + _uid
        }
    },

})