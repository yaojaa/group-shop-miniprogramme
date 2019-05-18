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
                    //发起网络请求index/get_openid
                    wx.request({
                      url: 'https://www.kaixinmatuan.cn/api/index/get_openid?appid=wx6ac9955f87c289f0&secret=250316f2d8d7bc841239fd11b538913c&js_code='+res.code+'&grant_type=authorization_code',
                      data: {
                        code: res.code
                      },
                      success: (response) => {
                        // 获取openId
                        // 
                        if(response.data.code == 200){

                        this.openId = response.data.data.openid;
                        this.session_key =response.data.data.session_key;
                        //  缓存 session_key
                        // 
                       wx.setStorage({key:'session_key',data:response.data.data.session_key})

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

  //获取微信用户信息

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
                url: 'https://www.kaixinmatuan.cn/api/index/login_by_openid',
                method: 'POST',
                data: {openid: this.openId,
                  session_key:this.session_key,
                  nickname: res.userInfo.nickName,
                  headimg: res.userInfo.avatarUrl,
                  encryptedData: res.encryptedData
                },
                success: (res) => {

                  if (res.data.code === 200) {
                    this.globalData.token = res.data.data.token
                    this.globalData.userInfo = res.data.data.user

                    wx.setStorage({//存储到本地
                      key:"token",
                      data:res.data.data.token
                    })

                    wx.setStorage({//存储到本地
                      key:"userInfo",
                      data:res.data.data.user
                    })

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
        url:'/pages/index/index'
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

    /**记录用户打开的场景**/
    if(option.scene){
    this.globalData.userScene = option.scene ||''

    }

      // 获取设备状态栏高度
        wx.getSystemInfo({
            success: e => {
              console.log(e)
                this.globalData.userPhone = e.model ||''
                this.globalData.StatusBar = e.statusBarHeight;
                this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
            }
        })
        //检测设备尺寸
        try {
            var SystemInfo = wx.getSystemInfoSync()
            this.globalData.winHeight = SystemInfo.windowHeight
            this.globalData.winWidth = SystemInfo.windowWidth
        } catch (e) {
            this.globalData.winHeight = 500
        }


    if(this.hasToken()){

      this.globalData.token = wx.getStorageSync('token')
      this.globalData.userInfo = wx.getStorageSync('userInfo')

      console.log('已经登录.退出')
      if(this.userLoginReadyCallback){
      this.userLoginReadyCallback(this.globalData.userInfo)
      }

      //从其它页面进入返回到首页
     // if( option.path !=='pages/goods/goods' && option.path!=='pages/ordermanage/list'){
     //                this.redirect2Home()
     //   }


    /**未登录或者缓存失效用户*/
    }else{

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
                   this.redirectToLogin()
                  }
                }
    })






    }



    this.checkAppVersion()


  },
      /**
     * 设置监听器
     */
    setWatcher(data, watch,context) { // 接收index.js传过来的data对象和watch对象
        Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
            this.observe(data, v,watch[v],context); // 监听data内的v属性，传入watch内对应函数以调用
        })
    },
 
    /**
     * 监听属性 并执行监听函数
     */
    observe(obj, key,watchFun,context) {
        var val = obj[key]; // 给该属性设默认值
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set: (value) =>{
                val = value;
                watchFun(value,val,context); // 赋值(set)时，调用对应函数
            },
            get: function() {
                return val;
            }
        })
    },
  globalData: {
    userInfo: null,
    token:null,
    openid:null,
    hasScope:false //授权获取用户信息状态
  }
})