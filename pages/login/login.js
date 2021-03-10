// pages/login/login.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        hasScope: false
    },
    onLoad: function() {


        const userInfo = app.globalData.userInfo

        if (userInfo !== null && Object.keys(userInfo).length > 0) {
            this.jump(userInfo)
        }


    },

    goView() {

        wx.navigateTo({
            url: '../create-home/index'
        })


    },

    onShareAppMessage: function() {

        return {
            title: '开心麻团 让团购简单'
        }
    },


    jump(d) {

       if (d.supplier) {


            return wx.redirectTo({
                url: '/business/pages/home/index'
            })

        } 
       
        else if (d.store && d.store.store_id) {

            return wx.switchTab({
                url: '../home/index'
            })

        }else {

            return wx.redirectTo({
                url: '../user-home/index'
            })

        }
    },



    /***点击授权按钮***/
    getUserInfoEvt: function(e) {


        console.log(e)

        wx.showLoading()

        if (e.detail.errMsg.indexOf('fail') >= 0) {

            wx.showToast({
                title: '请允许授权', //提示文字
                duration: 2000,
                icon: 'none'
                //显示时长
            })


            return
        }

        app.getOpenId().then(openid => {

            app.openid = openid;

            app.login_third(e.detail).then((res) => {


                    const d = res.data.data
                    var userInfo = {}
                    userInfo = d.user
                    userInfo['store'] = d.store
                    userInfo.supplier = d.supplier

                    this.jump(userInfo)


                    wx.hideLoading()
                })
                .catch(e => console.log(e))



        })



    }
})