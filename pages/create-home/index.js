const util = require('../../utils/util')

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        showAuth: false,
        store_name: '',
        wechatnumber: '',
        realname: '',
        mobile: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        const uInfo = app.globalData.userInfo || {}

        this.setData({
            store_logo: uInfo.headimg || '',
            store_name: uInfo.nickname || ''
        })
        this.getWxCode()



    },
    onChange(e) {
        wx.showLoading()

    },

    getWxCode() {
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    console.log(res)
                    this.data.code = res.code

                    util.wx.get('/api/index/get_openid', {
                        js_code: res.code
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.data.session_key = res.data.data.session_key
                        }
                    })
                }
            }
        })
    },
    //通过绑定手机号登录
    getPhoneNumber: function(e) {


        if(!app.globalData.userInfo){
            return this.setData({
                showAuth: true
            })
        }

        console.log(e)


        util.wx.post('/api/user/get_wx_mobile', {
            'encryptedData': e.detail.encryptedData,
            'iv': e.detail.iv,
            'session_key': this.data.session_key
        }).then((res) => {

            console.log(res.data.code, res.data.data.phoneNumber)

            if (res.data.code == 200 || res.data.code == 400611) {
                this.setData({
                    mobile: res.data.data.phoneNumber,
                    wechatnumber: res.data.data.phoneNumber
                })

                wx.showToast({
                    title: '获取手机号成功',
                    icon: 'none'
                })
                // wx.redirectTo({
                //     url: '/' + this.data.url + '?id=' + this.data.id
                // })
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })

                // this.getWxCode()

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

    cancel: function() {
        this.setData({
            showAuth: false
        })
    },

    submitForm(e) {
        const uInfo = app.globalData.userInfo || null

        if (!uInfo) {

            this.setData({
                showAuth: true
            })
            return
        }

        const postData = Object.assign({
            store_name: app.globalData.userInfo.nickname,
            wechatnumber: this.data.wechatnumber,
            realname: this.data.realname,
            mobile: this.data.mobile
        })

        util.wx.post('/api/user/store_apply', postData).then(res => {

          console.log(res.data.code)

            if (res.data.code == 200) {

                wx.showToast({
                    title: '申请成功～',
                    icon: 'none'
                })


                const d = res.data.data

                var userInfo = res.data.data.user;
                userInfo.store = res.data.data.store

                app.globalData.userInfo = userInfo

                wx.setStorage({ //存储到本地
                    key: "userInfo",
                    data: userInfo,
                    success: function() {

                        if (app.globalData.backUrl) {

                            wx.redirectTo({
                                url: app.globalData.backUrl
                            })

                            app.globalData.backUrl = null

                        } else {

                            wx.switchTab({
                                url: '/pages/home/index'
                            })

                        }



                    }
                })
            } else if (res.data.code == 2) {

                if (app.globalData.backUrl) {

                    wx.redirectTo({
                        url: app.globalData.backUrl
                    })

                    app.globalData.backUrl = null
                } else {

                    wx.switchTab({
                        url: '/pages/home/index'
                    })

                }

            } else {

                return wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }

        }).catch(e => {

            console.log(e)

        })



    },
    goPublish() {
        wx.redirectTo({
            url: '../userhome/index?id=7312'
        })
    },

    getUserInfoFile: function(){


        wx.showLoading()

        app.getUserInfoFile(r=>{

                    wx.hideLoading()
                    this.setData({
                        showAuth:false
                    })

        })
        
    },

    inputDuplex: util.inputDuplex,

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

    }
})