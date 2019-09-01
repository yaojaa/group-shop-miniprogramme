const app = getApp()
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
               wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                });
            }



        })



    },
    postInfo() {

     if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.mobile))){ 
             wx.showToast({
                        title: '手机号码有误',
                        icon: 'none'
                    });
            return false; 
        }


        util.wx.post('/api/user/user_set_info', {

            mobile: this.data.mobile,
            wechatnumber: this.data.wechatnumber
        }).then(res => {
            console.log(res)

            if (res.data.code == 200) {
                wx.showToast({
                    title:'保存成功',
                    icon:'none'
                })
            } else {
                wx.showToast({
                    title:res.data.msg,
                    icon:'none'
                })
            }
        },res=>{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
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