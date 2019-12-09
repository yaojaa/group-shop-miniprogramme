const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        showSetting: false,
        sharebar: false,
        poster: false,
        showAuth: false,
        onLoadOpt: null,
        overlay: true,
        shareIng: false,
        phone: '',
        weChat: ''
    },
    goContact(e) {
        const { phone, wx } = e.currentTarget.dataset
        this.setData({
            phone: phone,
            weChat: wx
        })
        Dialog.alert({
            selector: '#contact'
        })
    },
    copyWx(event) {
        wx.setClipboardData({
            data: this.data.weChat,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },
    phoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone
        })
    },
    toSetting() {
        console.log('toSetting..')
        wx.navigateTo({
            url: '../create_shop/index?store_id=' + this.store_id
        })
    },

    showShare() {
        this.setData({
            overlay: true,
            sharebar: true
        })
    },
    closeShareFriends() {
        this.setData({
            sharebar: false
        })
    },
    handlePoster() {
        this.setData({
            sharebar: false,
            poster: !this.data.poster
        })

        if (this.data.poster) {
            util.wx.get('/api/store/get_store_poster', {
                store_id: this.store_id
            }).then(res => {
                this.setData({
                    shareFriendsImg: res.data.data
                })
            }, res => {

                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            })
        }
    },
    savaSelfImages() {
        var _this = this;
        console.log('savaSelfImages', this.data.shareFriendsImg)


        wx.downloadFile({
            url: this.data.shareFriendsImg,
            success: (res) => {

                const imgUrl = res.tempFilePath

                // 用户授权
                wx.getSetting({
                    success(res) {
                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                    console.log(1)
                                    wx.saveImageToPhotosAlbum({
                                        filePath: imgUrl,
                                        success: function(data) {
                                            wx.showToast({
                                                title: '保存成功',
                                                icon: 'success',
                                                duration: 2000
                                            })
                                        }
                                    });
                                }
                            })
                        } else {
                            wx.saveImageToPhotosAlbum({
                                filePath: imgUrl,
                                success: function(data) {
                                    wx.showToast({
                                        title: '保存成功',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                }
                            });
                        }
                    }
                })







            }
        })




        if (this.data.shareFriendsImg) {


            this.handlePoster();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadPage(options);
    },
    onShow() {
        this.data.goodsList = [];

        this.setData({
            shareIng: false
        })

        this.data.onLoadOpt && this.loadPage(this.data.onLoadOpt);
    },
    loadPage(options) {

        if (options.scene) {
            options = decodeURIComponent(options.scene)
            options = options.split('?')[1] || options
            options = util.url2json(options)
        }



        this.store_id = options.id || options.store_id

        // let pages = getCurrentPages(); //当前页面栈

        // if (pages.length > 1) {
        //     this.setData({
        //         showIcon: true
        //     })
        //     console.log(true)
        // } else {
        //     showIcon: false
        //     console.log(false)

        // }


        if (app.globalData.userInfo && !this.data.onLoadOpt) {
            this.add_access()
        }

        this.cpage = 1
        this.getDataList(options)
        this.getStoreInfo(options)
    },

    add_access() {
        //增加访问记录
        util.wx.post('/api/index/add_access', {
            type: 'store_homepage',
            obj_id: this.store_id,
            user_scene: app.globalData.userScene,
            user_phone: app.globalData.userPhone,
            user_id:app.globalData.userInfo.user_id || ''
        })
    },

    getStoreInfo(options) {

        util.wx.get('/api/store/get_store_homepage', {
                store_id: this.store_id || app.globalData.userInfo.store_id
            })
            .then(res => {

                var store_slide

                // 存储赋值
                this.data.onLoadOpt = options;


                if (res.data.data.store_slide.length == 0) {
                    store_slide = ['https://static.kaixinmatuan.cn/c4ca4238a0b923820dcc509a6f75849b201906271717046776.jpg']
                } else {
                    store_slide =res.data.data.store_slide
                }

                this.setData({
                    store_slide: store_slide,
                    info: res.data.data,
                    showSetting: app.globalData.userInfo && app.globalData.userInfo.store_id == this.store_id ? true : false
                })
            }, res => {

            })


    },

    getDataList(options) {

        this.setData({
            loading: true
        })

        util.wx.get('/api/goods/get_store_goods_list', {
                store_id: this.store_id,
                cpage: this.cpage,
                pagesize: 5
            })
            .then(res => {
                // 存储赋值
                this.data.onLoadOpt = options;

                if (res.data.code == 200) {

                    res.data.data.goodslist.forEach(item => {

                        item._buy_users = item._buy_users.slice(0, 16)
                    })


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

        this.scrollTop = e.scrollTop

        if (this.timer) {
            return
        } else {

            this.timer = setTimeout(() => {

                this.setData({
                    scrollTop: this.scrollTop
                })

                clearTimeout(this.timer)
                this.timer = null

            }, 300)



        }





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

        if (res.from === 'button') {
            // 来自页面内转发按钮
            this.setData({
                overlay: false,
                sharebar: false,
                shareIng: true
            })

        } else {

            this.setData({
                shareIng: true
            })

        }

        return {
            title:  this.data.info.store_name + '邀请你来逛逛'
        }
    }
})