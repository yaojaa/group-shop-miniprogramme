//app.js
App({
  //是否本地有token
  hasToken:function(){
    console.log('getStorageSync',wx.getStorageSync('token'))

    return !!wx.getStorageSync('token')
  },
  //请求维系获取openId
  getOpenId:function(){

    console.log('getOpenId:function()')

    console.log('Promise',wx.login)

    return new Promise((resolve,reject)=>{

                    // 登录
              wx.login({
                success: res => {

          console.log('wx.login success')

                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  if (res.code) {
                    //发起网络请求
                    wx.request({
                      url: 'https://www.daohangwa.com/api/user/get_openid?appid=wxe15467ce01d6a579&secret=c5a0779552af01a0390964d1e3402964&js_code=' + res.code + '&grant_type=authorization_code',
                      data: {
                        code: res.code
                      },
                      success: (response) => {
                        // 获取openId
                        this.openId = response.data.data.openid;
                        // TODO 缓存 openId
                        this.globalData.openid = this.openId;
                        resolve(response.data.data.openid)
                      }
                    })
                  } else {
                      wx.showToast({
                        title: '获取用户登录态失败！',
                      icon: 'danger',
                      duration: 2000
                      })
                    console.log('获取用户登录态失败！' + res.errMsg)
                  }

                }
              })

    })



  },

      // 授权获取用户信息
  getUserInfoScopeSetting:function(){

   return new Promise((resolve, reject)=>{
     wx.getSetting({
       success: res => {

        if (this.userScopeReadyCallback) {
                  this.userScopeReadyCallback(res)
           }

         if (res.authSetting['scope.userInfo']) {
           resolve(true)

         } else {
           resolve(false)
         }
       }
     })
   })

  },

  //获取用户信息

  getUserInfo:function(){
   return new Promise((resolve, reject)=>{

          wx.getUserInfo({
            success: res => {
              console.log('getUserInfo', res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              resolve(res)
            }
          })

   })


  },

  //第三方服务器登录
  //
  // data: {
  //                 openid: this.openId,
  //                 nickname: res.userInfo.nickName,
  //                 head_pic: res.userInfo.avatarUrl,
  //                 encryptedData: res.encryptedData,
  //               }
  login_third:function(res){

    return new Promise((resolve, reject)=>{
              wx.request({
                url: 'https://www.daohangwa.com/api/user/login_third',
                method: 'POST',
                data: {openid: this.openId,
                  nickname: res.userInfo.nickName,
                  head_pic: res.userInfo.avatarUrl,
                  encryptedData: res.encryptedData
                },
                success: (res) => {

                  console.log('login_third data',res)

                  if (res.data.code === 0) {

                    console.log('服务器登录成功 token is', res.data.data.token, this)
                    this.globalData.token = res.data.data.token

                    wx.setStorageSync('token',res.data.data.token)
                    resolve(res)

                  } else {
                    reject(res.data.msg)
                  }

                }
        })
    })




  },

  redirect2Home:function(){

      console.log('wx.redirectTo...home...index')

      wx.redirectTo({
        url:'/pages/home/index'
      })
  },

  onLaunch: function () {


    console.group('app.js onLaunch')

    this.getOpenId()

    .then(()=>{

          console.group('获取到openId')


          this.getUserInfoScopeSetting().then((hasScope)=>{
          console.group('获取到hasScope:',hasScope)

                if(hasScope){

                  this.getUserInfo().then((res)=>{
         console.group('获取到UserInfo:',res)
                    this.login_third(res).then(()=>{ 
          console.group('登陆成功:',res)
                      this.redirect2Home() 
                    })
                    .catch( e => console.log(e) )

                  })

                }

              })




    })


    console.groupEnd()

   
  },
  globalData: {
    userInfo: null,
    token:null,
    openid:null
  }
})