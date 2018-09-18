// pages/login/login.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasScope:true
  },
  onLoad: function () {

    app.userScopeReadyCallback=(result)=>{
      console.log('userScopeReadyCallback',result)
      this.setData({
        hasScope:result.authSetting['scope.userInfo'] ? true : false
      })
    }

    app.userLoginReadyCallback = ()=>{
        app.redirect2Home() 
    }
  },
  getUserInfoEvt: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.login_third(e.detail).then((res)=>{ 
          console.group('登陆成功:',res)
                      app.redirect2Home() 
                    })
    .catch( e => console.log(e) )

  }
})
