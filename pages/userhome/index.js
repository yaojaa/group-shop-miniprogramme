const util = require('../../utils/util.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'http://www.51pptmoban.com/d/file/2018/05/17/ba0172ce98cc25c03fb2986e55205655.jpg',
            'http://www.wendangwang.com/pic/60ce9ebec47d22cc9b6ab14c/6-810-jpg_6-1080-0-0-1080.jpg',
            'http://www.pptbz.com/d/file/p/201708/5f02717ee482f36516721d482cbbe86b.jpg'
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        showIcon: false,
        goodsList: [],
        loading: false,
        store_id: '',
        info: {},
        scrollTop: 0,
        showSetting:false

    },
    toSetting() {
        console.log('toSetting..')
        wx.navigateTo({
            url: '../create_shop/index?store_id=' + this.store_id
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.store_id = options.id || options.store_id

        let pages = getCurrentPages(); //当前页面栈

        if (pages.length > 1) {
            this.setData({
                showIcon: true
            })
            console.log(true)
        } else {
            showIcon: false
            console.log(false)

        }

        this.cpage = 1
        this.getDataList()

        //主要信息
        this.getStoreInfo()
    },

    getStoreInfo() {
        //增加访问记录
        util.wx.post('/api/index/add_access',{
                type:'store_homepage', 
          obj_id: this.store_id,
          user_scene:app.globalData.userScene,
          user_phone:app.globalData.userPhone
        })



        util.wx.get('/api/store/get_store_homepage', {
                store_id: this.store_id
            })
            .then(res => {
                if (res.data.code == 200) {

                    console.log(res)

                    this.setData({
                        info: res.data.data,
                        showSetting: res.data.data.user_id == app.globalData.userInfo.user_id? true:false
                    })


                }
            })


    },

    getDataList() {

        this.setData({
            loading: true
        })

        util.wx.get('/api/goods/get_store_goods_list', {
                store_id: this.store_id,
                cpage: this.cpage,
                pagesize: 5
            })
            .then(res => {
                if (res.data.code == 200) {


                    this.data.goodsList = this.data.goodsList.concat(res.data.data.goodslist)

                    this.setData({
                        goodsList: this.data.goodsList,
                        loading: false

                    })


                    this.totalpage = res.data.data.page.totalpage
                }
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

    onPageScroll: function(e) {
        this.setData({
            scrollTop: e.scrollTop
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

        ++this.cpage

        if (this.cpage <= this.totalpage) {
            this.getDataList(); //重新调用请求获取下一页数据 
        }


    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        return {
            title: this.data.info.store_name
        }
    }
})