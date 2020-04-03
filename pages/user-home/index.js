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
                this.setData({
                    proList: res.data.data.goods,
                    is_loading: false
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
        this.getOrderCount()
    },
    goSupperReg(){
        wx.navigateTo({
            url:'/business/pages/create-home/index'
        })

    },

    goPublish(){
        wx.navigateTo({
            url:'../apply_shop/index'
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


        this.data.cpage = 1
        this.data.goodslist = []
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
    },
   
   

   
    addListen:util.sellerListner,

    
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

        this.data.cpage = 1
        this.data.goodslist = []
     
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

        ++this.data.cpage

        if (this.data.cpage <= this.totalpage) {
           // this.getGoodsList(); //重新调用请求获取下一页数据 
        } else {
            this.data.cpage = this.totalpage
        }

    },
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    },
    onShareAppMessage: function(e) {
        console.log(e)
        if (app.globalData.userInfo) {
            var _uid = app.globalData.userInfo.user_id
        }

        if(e.target.dataset.type =='goods'){

            const {cover,goods_name,goods_id} = e.target.dataset


        return {
            title:goods_name,
            imageUrl: cover+'?imageView2/2/w/600/h/400/format/jpg/q/85',
            path: 'pages/goods/goods?goods_id=' + goods_id
        }


        }



        return {
            title: app.globalData.userInfo.nickname + '推荐您一个好助手',
            imageUrl: this.shareImg,
            path: 'pages/login/login' + '?from_id=' + _uid
        }
    },

})