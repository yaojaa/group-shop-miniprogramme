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
        console.log('我app先执行@')
        if (this.userScopeReadyCallback) {
                  this.userScopeReadyCallback(res)
           }


         if (res.authSetting['scope.userInfo']) {
           this.globalData.hasScope = true
           resolve(true)

         } else {
            this.globalData.hasScope = false

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

            if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(this.globalData.userInfo)
           }
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
  redirectToLogin:function(){

     wx.redirectTo({
        url:'/pages/login/login'
      })
  },

  onLaunch: function () {


    console.log('getCurrentPages()',getCurrentPages())


    console.group('app.js onLaunch')


    Promise.all([this.getOpenId(),this.getUserInfoScopeSetting()]).then((result)=>{

        console.log('Promise all result',result)
        console.log('获取到openId',result[0])
        console.log('获取到hasScope',result[1])
        let hasScope = result[1]

       if(hasScope){

                  this.getUserInfo().then((ures)=>{
                    this.login_third(ures).then((res)=>{ 
                       if(this.userLoginReadyCallback){
                          this.userLoginReadyCallback(res)
                        }
                    
                    })
                    .catch( e => console.log(e) )

                  })

                }



    })

    console.groupEnd()

   
  },
  globalData: {
    userInfo: null,
    token:null,
    openid:null,
    hasScope:false //授权获取用户信息状态
  }
})