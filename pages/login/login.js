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

       
        if (d.store && d.store.store_id) {

            return wx.switchTab({
                url: '../home/index'
            })

        } else if (d.supplier) {


            return wx.redirectTo({
                url: '/business/pages/home/index'
            })

        } else {

            return wx.redirectTo({
                url: '../user-home/index'
            })

        }
    },

    getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
      }
    })
  },

    /***点击授权按钮***/
    getUserInfoEvt: function(e) {

        wx.showLoading()

        app.getUserInfoFile(r=>{


                    const d = r.data.data
                    var userInfo = {}
                    userInfo = d.user
                    userInfo['store'] = d.store
                    this.jump(userInfo)
                    wx.hideLoading()

        })


        // app.getOpenId().then(openid => {

        //     app.openid = openid;

        //     app.login_third(e.detail).then((res) => {


        //             const d = res.data.data
        //             var userInfo = {}
        //             userInfo = d.user
        //             userInfo['store'] = d.store
        //             userInfo.supplier = d.supplier

        //             this.jump(userInfo)
        //             wx.hideLoading()
        //         })
        //         .catch(e => console.log(e))



        // })



    }
})