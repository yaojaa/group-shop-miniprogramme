// pages/login/login.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasScope:false
  },
  onLoad: function () {


    const userInfo = app.globalData.userInfo

    console.log('userInfo',userInfo)
    if(userInfo){
          this.jump(userInfo)

    }

          

 

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


  jump(d){
               if(d.supplier){

            wx.redirectTo({
              url:'/business/pages/home/index'
            })

           } else if(d.store || d.store_id){

              wx.redirectTo({
                url:'../home/index'
              })

           }else{

             wx.redirectTo({
                url:'../user-home/index'
              })

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


           const d = res.data.data

           this.jump(d)


          wx.hideLoading()
                    })
    .catch( e => console.log(e) )



    })



  }
})
