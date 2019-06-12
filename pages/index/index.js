//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userloaction: {

        },
        isloading: true,
        proList: []
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

        if (detail.key == 'home') {
            wx.navigateTo({
                url: '../home/index'
            })
        }

    },
    onLoad: function() {

        console.log('首页onload执行')


        if (app.globalData.userInfo) {

            this.getProList()

            this.getFriendList()

            this.getloactionData()

        } else {
            console.log('首页onload redirectToLogin')

            app.redirectToLogin()

        }










        // wx.getSetting({
        //   success :(res)=> {
        //     console.log(res.authSetting)
        //     // res.authSetting = {
        //     //   "scope.userInfo": true,
        //     //   "scope.userLocation": true
        //     // }
        //     if(res.authSetting['scope.userLocation']){
        //        this.getloactionData()
        //     }else{
        //         this.setData({
        //             showOpenBtn:true
        //         })
        //     }
        //   }
        // })


    },
    //获取定为并获取商品
    getloactionData() {


        util.getUserloaction(res => {
                console.log('经纬度：', res)
                this.data.latitude = res.latitude,
                    this.data.longitude = res.longitude
                app.globalData.lat = res.latitude
                app.globalData.lng = res.longitude

                this.getProListBylocation()
            })


            .then(res => {
                this.setData({
                    userloaction: res,
                    latitude: res.latitude,
                    longitude: res.longitude
                })
            })
            .catch(e => {
                console.log(e.errMsg)
                if (e.errMsg.indexOf('auth')) {

                    this.setData({
                        showOpenBtn: true
                    })

                }

                this.setData({
                    isloading: false
                })
            })
    },

    openSetting() {

        wx.openSetting({
            success: (res) => {
                console.log(res.authSetting)
                // res.authSetting = {
                //   "scope.userInfo": true,
                //   "scope.userLocation": true
                // }
                if (res.authSetting['scope.userLocation']) {

                    wx.showToast({
                        title: '获取定位授权' + res.authSetting['scope.userLocation']
                    })
                    this.setData({
                        showOpenBtn: false
                    })
                    this.getloactionData()

                }
            }
        })



    },

    getProList() {


        util.wx.get('/api/user/get_browsed_goods').then(res => {


            if (res.data.code == 200) {
                console.log('getProList')
                this.setData({
                    proList: res.data.data.goods
                })
            }
        })

    },
    getFriendList() {

        util.wx.get('/api/user/friend_bought').then(res => {
            if (res.data.code == 200) {
                this.setData({
                    friendList: res.data.data
                })
            }
        })

    },
    getProListBylocation() {

        util.wx.get('/api/user/discover', {
            latitude: this.data.latitude,
            longitude: this.data.longitude
        }).then(res => {

            if (res.data.code == 200) {


                var alldata = this.data.proList.concat(res.data.data.nearby_goods)

                this.setData({
                    proList: alldata,
                    isloading: false
                })
            }
        })



    },
    toDetail(e) {
        console.log(e)
        let postId = e.currentTarget.dataset.id || e.target.dataset.id
        wx.navigateTo({
            url: '../goods/goods?goods_id=' + postId
        })
    },
    addGoods() {
        wx.navigateTo({
            url: '../publish/publish'
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return util.shareConfig({
            title: '来看看你附近有什么好东西'
        })()
    },
    // onReachBottom(){

    //    ++ this.pageNum

    //    if(this.pageNum <= this.maxPage){
    //     this.getProList();//重新调用请求获取下一页数据 
    //    }


    // }

})