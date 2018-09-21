// pages/login/login.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasScope:true
  },
  onLoad: function () {
          console.log('我page先执行@')

          if(app.globalData.userInfo){
               this.setData({
                  hasScope:app.globalData.hasScope
                })

          }else{

            app.userScopeReadyCallback=(result)=>{
              console.log('11111111userScopeReadyCallback', result.authSetting['scope.userInfo'] ? true : false)
              this.setData({
                hasScope: result.authSetting['scope.userInfo'] ? false : true
              })

              console.log(this.data.hasScope)
            }

            app.userLoginReadyCallback = ()=>{
                app.redirect2Home() 
            }

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
