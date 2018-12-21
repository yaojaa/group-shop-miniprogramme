//app.js
App({
  //是否本地有token
  hasToken:function(){
    return !!wx.getStorageSync('token')
  },
  //请求维系获取openId
  getOpenId:function(){

    return new Promise((resolve,reject)=>{

                    // 登录
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  if (res.code) {
                    //发起网络请求
                    wx.request({
                      url: 'https://www.daohangwa.com/api/user/get_openid?appid=wx6ac9955f87c289f0&secret=250316f2d8d7bc841239fd11b538913c&js_code='+res.code+'&grant_type=authorization_code',
                      data: {
                        code: res.code
                      },
                      success: (response) => {
                        // 获取openId
                        // 
                        if(response.data.code == 0){

                        this.openId = response.data.data.openid;
                        this.session_key =response.data.data.session_key;
                        //  缓存 session_key
                        // 
                       wx.setStorageSync('session_key',response.data.data.session_key)

                        this.globalData.openid = this.openId;
                        resolve(response.data.data.openid)
                        }else{
                           wx.showToast({
                            title: '用户登录态失败！',
                            duration: 3000
                            })
                        }
 
                      },
                      fail:(err)=>{
                         wx.showToast({
                        title: '用户登录态失败！',
                         duration: 3000
                      })
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

         if (res.authSetting['scope.userInfo']) {
           this.globalData.hasScope = true
           resolve(true)

         } else {
            this.globalData.hasScope = false

           resolve(false)
         }

         if (this.userScopeReadyCallback) {
             this.userScopeReadyCallback(this.globalData.hasScope)
           }


       }
     })
   })

  },

  //获取用户信息

  getUserInfo:function(nocallback){
   return new Promise((resolve, reject)=>{

          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

            if (this.userInfoReadyCallback ) {
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
                  session_key:this.session_key,
                  nickname: res.userInfo.nickName,
                  head_pic: res.userInfo.avatarUrl,
                  encryptedData: res.encryptedData
                },
                success: (res) => {

                  console.log('login_third data',res)

                  if (res.data.code === 0) {

                    console.log('服务器登录成功 token is', res.data.data)
                    this.globalData.token = res.data.data.token
                    this.globalData.userInfo = res.data.data
                    // wx.setStorageSync('session_key',res.data.data.token)
                    wx.setStorageSync('token',res.data.data.token)
                    wx.setStorageSync('userInfo',res.data.data)

                    resolve(res)

                  } else {
                    reject(res.data.msg)
                  }

                }
        })
    })




  },

  redirect2Home:function(){
    
      wx.redirectTo({
        url:'/pages/home/index'
      })
  },
  redirectToLogin:function(){

     wx.redirectTo({
        url:'/pages/login/login'
      })
  },

  /****checkssion*****/

  checkSession(){
    wx.checkSession({
　　　　success: function(res){
　　　　　　console.log("处于登录态");
　　　　},
　　　　fail: (res)=>{
　　　　　　console.log("需要重新登录");
          this.get_openid()
　
　　　　}
　　})
  },

  /***检测版本更新**/

  checkAppVersion(){

    if(typeof wx.getUpdateManager == 'undefined' ){
      return 
    }


    const updateManager = wx.getUpdateManager() || false



      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
        
      })

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
      })
  },

  onLaunch: function (option) {

    console.group('启动检测---')
    console.log('hasToken',this.hasToken())
    console.log('option',option)


    if(this.hasToken()){

      this.globalData.token = wx.getStorageSync('token')
      this.globalData.userInfo = wx.getStorageSync('userInfo')

      console.log('已经登录.退出')
      if(this.userLoginReadyCallback){
      this.userLoginReadyCallback(this.globalData.userInfo)
      }



       if(option.path !=='pages/goods/goods' && option.path!=='pages/ordermanage/list'){
                    this.redirect2Home()
       }


    /**未登录或者缓存失效用户*/
    }else{

    console.log('无token')

     Promise.all([this.getOpenId(),this.getUserInfoScopeSetting()]).then((result)=>{
      console.log('result',result)
       if(result[1]){
                  this.getUserInfo().then((ures)=>{
                    this.login_third(ures).then((res)=>{ 
                       if(this.userLoginReadyCallback){
                          this.userLoginReadyCallback(res.data.data)
                        }
                    
                    })
                    .catch( e => console.log(e) )

                  })
                }else{
                  if(option.path =='pages/goods/goods' || option.path=='pages/login/login'){
                    
                      console.log('无授权停止',option.path =='pages/goods/goods' || option.path=='pages/login/login')
                    
                  }else{
                    //this.redirectToLogin()
                  }
                }
    })






    }


    console.groupEnd()


    this.checkAppVersion()


  },
  globalData: {
    userInfo: null,
    token:null,
    openid:null,
    hasScope:false //授权获取用户信息状态
  }
})