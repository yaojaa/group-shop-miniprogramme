// pages/login/login.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasScope:false
  },
  onLoad: function () {
    console.log('登录页onload')
          if(app.hasToken()){
               this.setData({
                  hasScope:true
                })

            app.redirect2Home()

          }else{

            app.userScopeReadyCallback=(result)=>{
                  console.log('userScopeReadyCallback',result)
              this.setData({
                hasScope:result
              })

              console.log('卸载call否则会多次执行')

              app.userScopeReadyCallback == null

              if(result){
                 app.redirect2Home()
              }

            }



          }



 

  },
  /***点击授权按钮***/
  getUserInfoEvt: function (e) {

    console.log(e)

    if(e.detail.errMsg =='getUserInfo:fail auth deny'){

       wx.showToast({
         title: '请允许授权',//提示文字
         duration:2000//显示时长
      })
       return
     }

    app.login_third(e.detail).then((res)=>{ 
          console.group('登陆成功:',res)
          wx.hideLoading()
                      app.redirect2Home() 
                    })
    .catch( e => console.log(e) )

  }
})
