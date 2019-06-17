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
        showOpenBtn:false,
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
            wx.redirectTo({
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


    },
    //获取定为并获取商品
    getloactionData() {

        //
        if(app.globalData.lat){

          this.getProListBylocation(app.globalData.lat,app.globalData.lng)
        
         this.setData({

          city:app.globalData.city,
          district:app.globalData.district
         })

         return

        }


   util.getUserloaction(res => {
                        console.log('经纬度：', res)
                        app.globalData.lat = res.latitude
                        app.globalData.lng = res.longitude

                        this.getProListBylocation(app.globalData.lat,app.globalData.lng)
                    })
                    

                    .then(res => {
                        console.log(res)

                        const{city,district} = res

                        app.globalData.city = city
                        app.globalData.district = district

                        this.setData({
                            userloaction: {
                                city,
                                district
                            },
                            latitude: res.latitude,
                            longitude: res.longitude
                        })
                    })
                    .catch(e=>{
                      console.log(e.errMsg, e.errMsg.indexOf('auth'))
                        if(e.errMsg.indexOf('auth')>0){

                            this.setData({
                                showOpenBtn:true
                            })

                        }

                        if(e.errCode && e.errCode == 2){
                            wx.showToast({
                                title:'建议打开GPS获取定位',
                                icon:'none'
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
    getProListBylocation(lat,lng) {

        util.wx.get('/api/user/discover', {
            latitude: lat,
            longitude: lng
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