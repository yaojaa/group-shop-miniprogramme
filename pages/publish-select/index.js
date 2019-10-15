const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {

  	showAuth:false

  },
  onLoad: function (e) {

  	      //未登录 弹出授权弹窗
        if (!app.globalData.userInfo) {
               this.setData({
                            showAuth: true
               })
           }


 



  },
    rejectAuth() {
        this.setData({
            showAuth: false
        })
    },
      getUserInfoEvt: function(e) {
        console.log(e)
        if (e.detail.errMsg !== "getUserInfo:ok") {
            return wx.showToast({ 'title': '允许一下又不会怀孕', icon: 'none' })
        }

        app.globalData.userInfo = e.detail.userInfo
        wx.showLoading()
        app.getOpenId().then((openid) => {
            console.log(openid)
            app.globalData.openid = openid
            app.login_third(e.detail).then((res) => {
            	
                    wx.showToast({
                    	title:'登录成功',
                    	icon:'none'
                    })

                    wx.hideLoading()
                    this.setData({
                        showAuth: false
                    })

                })
                .catch(e => console.log(e))


        })


    },
   

})
