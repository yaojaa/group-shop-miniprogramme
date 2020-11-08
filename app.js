//app.js

import config from './utils/conf.js'

App({

    url2json : function(string, overwrite) {
    var obj = {},
        pairs = string.split('&'),
        d = decodeURIComponent,
        name, value;

    pairs.forEach((item, i) => {
        var pair = item.split('=');
        name = d(pair[0]);
        value = d(pair[1]);
        obj[name] = value;

    })
    return obj;
},

    //请求维系获取openId
    getOpenId: function() {

        console.log(config.apiUrl)

        return new Promise((resolve, reject) => {
            // 登录
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (res.code) {
                        //发起网络请求index/get_openid
                        wx.request({
                            url: config.apiUrl+'/api/index/get_openid?js_code=' + res.code,
                            data: {
                                code: res.code
                            },
                            success: (response) => {
                                // 获取openId
                                // 
                                if (response.data.code == 200) {

                                    this.openId = response.data.data.openid;
                                    this.session_key = response.data.data.session_key;

                                    this.globalData.openid = this.openId;
                                    resolve(response.data.data.openid)
                                } else {
                                    reject()
                                    wx.showToast({
                                        title: '用户登录态失败！',
                                        duration: 3000
                                    })
                                }

                            },
                            fail: (err) => {
                                wx.showToast({
                                    title: '用户登录态失败！',
                                    duration: 3000
                                })
                                reject()
                            }
                        })
                    } else {
                        wx.showToast({
                            title: '获取用户登录态失败！',
                            icon: 'danger',
                            duration: 2000
                        })
                        reject()
                        console.log('获取用户登录态失败！' + res.errMsg)
                    }

                }
            })

        })



    },

    // 授权获取用户信息
    getUserInfoScopeSetting: function() {

        return new Promise((resolve, reject) => {
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

    getUserInfo: function(nocallback) {
        return new Promise((resolve, reject) => {

            wx.getUserInfo({
                success: res => {
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
    login_third: function(res) {

        return new Promise((resolve, reject) => {
            wx.request({
                url: config.apiUrl+'/api/index/login_by_openid',
                method: 'POST',
                data: {
                    openid: this.openId,
                    session_key: this.session_key,
                    nickname: res.userInfo.nickName,
                    headimg: res.userInfo.avatarUrl,
                    encryptedData: res.encryptedData,
                    ...this.comeInfo
                },
                success: (res) => {

                    if (res.data.code === 200) {
                      
                      const d = res.data.data
                        var userInfo = d.user
                            
                            if(d.hasOwnProperty('store')){
                                userInfo.store =  d.store
                            }

                             if(d.hasOwnProperty('supplier')){
                                userInfo.supplier =  d.supplier
                            }
                            
                        this.globalData.token = d.token 
                        this.globalData.userInfo = userInfo

                        wx.setStorage({ //存储到本地
                            key: "userInfo",
                            data: this.globalData.userInfo
                        })
                    

                        resolve(res)

                    } else {
                        reject(res.data.msg)
                    }

                }
            })
        })




    },

    redirect2Home: function() {

        wx.redirectTo({
            url: '/pages/home/index'
        })
    },
    redirectToLogin: function() {

        console.log('redirectToLogin')

        wx.redirectTo({
            url: '/pages/login/login'
        })

    },

    /****checkssion*****/

    checkSession() {
        wx.checkSession({
            success: function(res) {
                console.log("处于登录态");
            },
            fail: (res) => {
                console.log("需要重新登录");
                this.get_openid()

            }
        })
    },

    /***检测版本更新**/

    checkAppVersion() {

        if (typeof wx.getUpdateManager == 'undefined') {
            return
        }

        const updateManager = wx.getUpdateManager() || false

        updateManager.onCheckForUpdate(function(res) {
            // 请求完新版本信息的回调
        })

        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })

        })

        updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
        })
    },

    onLaunch: function(option) {

        console.group('启动检测onLaunch---')
        console.log('option', option)

        this.comeInfo = {}

    

        /**记录用户打开的场景**/
        if (option.scene) {
            this.globalData.userScene = option.scene || ''
        }

        // 获取设备状态栏高度
        wx.getSystemInfo({
            success: e => {
                console.log(e)
                this.globalData.userPhone = e.model || ''
                this.globalData.StatusBar = e.statusBarHeight;

                this.globalData.winHeight = e.windowHeight
                this.globalData.winWidth = e.windowWidth
                this.globalData.statusBarHeight = e.statusBarHeight
                this.globalData.systemInfo = e


                  try {
                   let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                
                } catch (e) {
                    this.globalData.CustomBar = e.statusBarHeight+20
                }

            }
        })
        //检测胶囊高度
           var menu = wx.getMenuButtonBoundingClientRect()
    console.log('菜单按键宽度：',menu.width)
    console.log('菜单按键高度：',menu.height)
    console.log('菜单按键top：',menu.top)

         this.globalData.menuBarTop = menu.top;


    


        const userInfo = wx.getStorageSync('userInfo')
        console.log('userInfo', userInfo)
        if (userInfo) {
            this.globalData.token = userInfo.token
            this.globalData.userInfo = userInfo

            //兼容旧版本
            //
            if(userInfo.store && userInfo.store.store_id ){

                this.globalData.userInfo.store_id = userInfo.store.store_id
            }

            if( userInfo.hasOwnProperty('store_id')){

                this.globalData.userInfo.store_id = userInfo.store_id
            }

        
            if (this.userLoginReadyCallback) {
                this.userLoginReadyCallback(this.globalData.userInfo)
            }

        }



        this.checkAppVersion()

        wx.setEnableDebug({
          enableDebug: true
        })


    },
    /**
     * 设置监听器
     */
    setWatcher(data, watch, context) { // 接收index.js传过来的data对象和watch对象
        Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
            this.observe(data, v, watch[v], context); // 监听data内的v属性，传入watch内对应函数以调用
        })
    },

    /**
     * 监听属性 并执行监听函数
     */
    observe(obj, key, watchFun, context) {
        var val = obj[key]; // 给该属性设默认值
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set: (value) => {
                val = value;
                watchFun(value, val, context); // 赋值(set)时，调用对应函数
            },
            get: function() {
                return val;
            }
        })
    },
    globalData: {
        userInfo: null,
        token: null,
        openid: null,
        hasScope: false //授权获取用户信息状态
    }
})