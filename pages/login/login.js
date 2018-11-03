// pages/login/login.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasScope:false
  },
  onLoad: function () {

    console.log('登录页onload')


            // app.userLoginReadyCallback = ()=>{
            //     app.redirect2Home() 
            // }

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

              if(result){
                 app.redirect2Home()
              }

            }



          }



 

  },
  /***点击授权按钮***/
  getUserInfoEvt: function (e) {

  

    app.login_third(e.detail).then((res)=>{ 
          console.group('登陆成功:',res)
          wx.hideLoading()
                      app.redirect2Home() 
                    })
    .catch( e => console.log(e) )

  }
})
