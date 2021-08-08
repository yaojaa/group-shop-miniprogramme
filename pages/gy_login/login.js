//index.js
//获取应用实例
const util = require('../../utils/util')
const app = getApp()

Page({
  inputDuplex:util.inputDuplex,
  data: {
    phone:'13718134511',
    code:'1234'
  },
  onLoad: function () {
    
  },

  /**登录**/
  loginSubmit(){

    util.wx.post('/api/business/login/phoneLogin',
    {
      phone:this.data.phone,
      code: this.data.code || '1234'
    }).then((res)=>{

      console.log(res.data.code)

       // wx.navigateTo({
       //      url: '../selcetGroup/selcetGroup?source=activity'
       //  })
       //  
       wx.switchTab({
          url: '../home/home'
        })

       wx.navigateTo({
                  url:'../home/home'
                })

      if(res.data.code==0){

        wx.showToast({title:res.data.data.business_bank_user+',欢迎回来',icon:'none'})

        wx.setStorageSync('userInfo',res.data.data)
        wx.setStorageSync('SID',res.header.SID)
        wx.navigateTo({
                  url:'../home/home'
                })
       


      }else{
        wx.showToast({title:res.data.msg,icon:'none'})
      }


    })



  },


  /**获取验证码**/
  getCode: function(e) {

    util.wx.get('/api/business/login/sendLoginCode',{phone:this.data.phone}).then((res)=>{
      console.log(res.data.code==0)
      if(res.data.code==0){

       wx.showToast({title:'发送成功',icon:'none'})


      }else{
        wx.showToast({title:res.data.msg,icon:'none'})
      }
    })


  }
})
