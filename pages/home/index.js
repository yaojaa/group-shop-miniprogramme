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
        store_money: 0,
        pending_money: 0

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
    recommendHandle() {

        this.data.goodslist = []

        this.getGoodsList()

    },
    removeHandle(e) {
        console.log(e, '删除成功事件')

        var id = e.detail

        var c

        this.data.goodslist.forEach((item, index) => {
            console.log(item.goods_id, id)

            if (item.goods_id == id) {
                c = index
            }
        })

        if (c) {

            this.data.goodslist.splice(c, 1)

            this.setData({
                'goodslist': this.data.goodslist
            })

        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.data.cpage = 1





        if (typeof app.globalData.userInfo == 'undefined' || app.globalData.userInfo == null) {
            app.redirectToLogin()
        } else {

            this.setData({
                userInfo: app.globalData.userInfo
            })
        }


        this.data.cpage = 1
        this.data.goodslist = []
        // this.getGoodsList()
        //this.getOrderCount()

    },
    getOrderCount() {

        util.wx.get('/api/user/get_order_count_groupby_static').then(res => {
            console.log(res)
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

    goHome() {

        wx.redirectTo({
            url: '../userhome/index'
        })


    },

    get_store_info() {
        console.log('get_store_info')

        util.wx.get('/api/seller/get_store_money').then(res => {
            console.log(res)
            if (res.data.code == 200) {
                console.log('store_money: res.data.data.store_money', res.data.data.store_money)
                this.setData({
                    pending_money: res.data.data.pending_money
                })
            }
        })
    },


    getGoodsList: function() {

        this.setData({
            is_loading: true
        })

        util.wx.get('/api/seller/get_goods_list', {
                cpage: this.data.cpage,
                pagesize: 10
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
            url: '../publish-select/index'
        })
    },
    fansPage() {
        wx.navigateTo({
            url: '../fans/index'
        })
    },
    goSite() {
        console.log(this.data.userInfo.store_id)
        wx.navigateTo({
            url: '../userhome/index?id=' + this.data.userInfo.store_id
        })
    },
    editPage(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: '../publish/publish?goods_id=' + url,
        })
    },
    detailPage(e) {
        let url = e.currentTarget.dataset.url
        let name = e.currentTarget.dataset.name
        let delivery_method = e.currentTarget.dataset.delivery_method

        wx.navigateTo({
            url: '../ordermanage/list?goods_id=' + url + '&goods_name=' + name + '&delivery_method=' + delivery_method,
        })
    },
    //复制商品
    copyGoods(e) {
        const goods_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../publish/publish?copy=' + goods_id
        })


    },





    onShow() {
        this.data.cpage = 1

        this.data.goodslist = []
        this.getGoodsList()
        this.getOrderCount()


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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

        ++this.data.cpage

        if (this.data.cpage <= this.totalpage) {
            this.getGoodsList(); //重新调用请求获取下一页数据 
        } else {
            this.data.cpage = this.totalpage
        }


    },
    onPageScroll: function(e) {
        this.setData({
            scrollTop: e.scrollTop
        })
    },
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    }

})