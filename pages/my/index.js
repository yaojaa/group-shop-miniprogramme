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
        isCustome: true,
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

    handleTabBarChange({ detail }) {
        this.setData({
            current: detail.key
        })

        if (detail.key == 'publish') {
            wx.navigateTo({
                url: '../publish-select/index'
            })
        }

        if (detail.key == 'nearby') {
            wx.redirectTo({
                url: '../index/index'
            })
        }

    },
    //切换显示隐藏状态事件
    recommendHandle(e) {

        //  console.log(e.detail)

        // this.data.goodslist.forEach((item,index)=>{

        //      if(item.goods_id == e.detail){

        //          const key = 'goodslist['+index+'].is_recommend'

        //          this.setData({
        //              [key]: e.detail.is_recommend
        //          })
        //      }

        // })

        // this.getGoodsList()

    },
    removeHandle(e) {
        console.log(e, '删除成功事件')

        var id = e.detail

        var c = null


        this.data.goodslist.forEach((item, index) => {
            console.log(item.goods_id, id)

            if (item.goods_id == id) {
                c = index
            }
        })

        if (c !== null) {

            this.data.goodslist.splice(c, 1)

            this.setData({
                'goodslist': this.data.goodslist
            })

        }

    },
    onshow() {
        wx.hideHomeButton();

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideHomeButton()

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


        this.data.cpage = 1
        this.data.goodslist = []
        this.get_store_info()

        this.getGoodsList()
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

            console.log(this.data.isCustome)

            if(this.data.isCustome){
               this.getProList()
            }else{
             this.getOrderList()
            }


        
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


    getGoodsList: function() {

        this.setData({
            is_loading: true
        })

        util.wx.get('/api/seller/get_goods_list', {
                cpage: this.data.cpage,
                pagesize: 15
            })
            .then(res => {

                if (res.data.code == 200) {
                    this.setData({
                        goodslist: this.data.goodslist.concat(res.data.data.goodslist),
                        is_loading: false
                    })

                    this.data.goodslist.forEach(item => {

                        if (item._order_status1_count > 0) {
                            this.setData({
                                hasNewOrder: true
                            })
                        }



                    })




                    this.totalpage = res.data.data.page.totalpage


                } else {
                    this.setData({
                        is_loading: false
                    })
                }
            })

    },
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