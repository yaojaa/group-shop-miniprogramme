//index.js
//获取应用实例
const util = require('../../utils/util')
const app = getApp()

Page({
    inputDuplex: util.inputDuplex,
    data: {
        phone: '',
        code: '',
        sixty: 0,
        timer: null,
        on: ''
    },
    onLoad: function() {

      util.setWatcher.call(this,this.watch)


    },
    onUnload: function() {
        clearInterval(this.timer)

    },
    watch: {
        
        code: function(val) {
            console.log('watch...',val)
            this.setColor()
        },
        phone: function(val) {
            console.log('watch...',val)
            this.setColor()

        }
    },
    setColor() {

        console.log('setColor', this.data.phone, this.data.code)

        if (this.data.phone.length == 11 && this.data.code.length > 3) {

            this.setData({
                on: 'on'
            })

        } else {

            this.setData({
                on: ''
            })

        }


    },

    /**登录**/
    loginSubmit() {

        util.wx.post('/api/business/login/phoneLogin', {
            phone: this.data.phone,
            code: this.data.code
        }).then((res) => {

            console.log(res)

            if (res.data.code == 0) {

                wx.showToast({ title: res.data.data.business_name + ',欢迎回来', icon: 'none' })

                try{

                  wx.setStorageSync('userInfo', res.data.data)

                wx.switchTab({
                    url: '../home/home'
                })

                }catch(err){

                    wx.showToast({
                        title:'登录失败'+err.toString(),
                        icon:'none'
                    })

                }

                

               


            } else {
                wx.showToast({ title:'登录失败'+res.data.msg.toString(), icon: 'none' })
            }


        })



    },


    /**获取验证码**/
    getCode: function(e) {


        if (!this.data.phone) {

            wx.showToast({
                title: '请填写手机号', //提示文字
                duration: 2000, //显示时长
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                icon: 'none' //图标，支持"success"、"loading"  

            })

            return
        }






        util.wx.get('/api/business/login/sendLoginCode', { phone: this.data.phone })
        .then((res) => {

            if (res.data.code == 0) {
                wx.showToast({ title: '验证码已发送', icon: 'none' })

                //倒计时
                var sixty = 60
                this.timer = setInterval(() => {
                    --sixty
                    this.setData({
                        'sixty': sixty
                    })
                    if (sixty == 0) {
                        this.setData({
                            'sixty': 0
                        })
                        clearInterval(this.timer)

                    }
                    console.log(sixty)
                }, 1000)



            } else {
                wx.showToast({ title: res.data.msg, icon: 'none' })
            }
        })
        .catch((err)=>{
            {
           wx.showToast({ title: err, icon: 'none' })
        }
        })

    },
      onShareAppMessage: function () {

    return {
      title:'偷偷美微掌柜登录',
      path:'/pages/login/login',
      imageUrl: 'https://img.toutoumei.com/business/img/share_img.png'
    }
    
  }
})