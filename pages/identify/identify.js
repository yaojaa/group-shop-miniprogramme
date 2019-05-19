const app = getApp()
const { $Message } = require('../../iView/base/index')
const util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        wechatnumber: ''
    },

    getInfo() {

        util.wx.get('/api/user/user_info').then(res => {
            console.log(res.data.data.wechatnumber)

            if (res.data.code == 200) {
                this.setData({
                    mobile: res.data.data.mobile,
                    wechatnumber: res.data.data.wechatnumber
                })
            } else {
                $Message({
                    content: res.data.msg,
                    type: 'error'
                });
            }



        })



    },
    postInfo() {
        util.wx.post('/api/user/user_set_info', {

            mobile: this.data.mobile,
            wechatnumber: this.data.wechatnumber
        }).then(res => {
            console.log(res)

            if (res.data.code == 200) {
                $Message({
                    content: '保存成功',
                    type: 'success'
                });
            } else {
                $Message({
                    content: res.data.msg,
                    type: 'error'
                });
            }



        })

    },
    changeMobile(e) {
        console.log(e)
        this.setData({
            mobile: e.detail.value
        })

    },
    changeWX(e) {

        this.setData({
            wechatnumber: e.detail.value
        })

    },
    getPhoneNumber(e) {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_wx_mobile',
            method: 'post',
            data: {
                token: app.globalData.token,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
                session_key: wx.getStorageSync('session_key')

            },
            success: (res) => {
                this.setData({
                    mobile: res.data.data.phoneNumber
                })

            }
        })
    },
    clearStorage() {

        wx.clearStorageSync()

        wx.redirectTo({
            url: '../login/login'
        })

        //上传相册
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.getInfo()

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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})