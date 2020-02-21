// pages/login/login.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasScope:false
  },
  onLoad: function () {
          

 

  },



  goView(){

    wx.navigateTo({
      url:'../publish/publish'
    })


  },

      onShareAppMessage: function() {
       
        return {
        title:'开心麻团 让团购简单'
        }
    },



  /***点击授权按钮***/
  getUserInfoEvt: function (e) {


    console.log(e)

    wx.showLoading()

    if(e.detail.errMsg.indexOf('fail') >= 0){

       wx.showToast({
         title: '请允许授权',//提示文字
         duration:2000,
         icon:'none'
         //显示时长
      })

       
       return
     }

    app.getOpenId().then(openid=>{

          app.openid = openid;

          app.login_third(e.detail).then((res)=>{ 
          console.group('登陆成功:',res)
          wx.hideLoading()
                      app.redirect2Home() 
                    })
    .catch( e => console.log(e) )



    })



  }
})
