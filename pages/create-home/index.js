const util = require('../../utils/util')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      loading:false,
      showAuth: false,
      store_name:'',
      wechatnumber:'',
      realname:'',
      mobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const uInfo = app.globalData.userInfo || {}

    if(uInfo && uInfo.hasOwnProperty('store_id')){

      wx.redirectTo({
        url:'../home/index'
      })

    }else{

      // this.setData({
      //   showAuth:true
      // })
    }

    this.setData({
      store_logo:uInfo.headimg || '',
      store_name:uInfo.nickname || ''
    })




  },
   onChange(e) {
      wx.showLoading()

    },
    onSuccess(e,l) {

      wx.showToast({
        title:'上传成功',
        icon:'none'
      })

        const data = JSON.parse(e.detail)

        this.setData({
          supplier_logo:data.data.file_url
        })
    },
    onFail(e) {
    wx.showToast({
            title:'上传失败请重试',
            icon:'none'
          })    
},
    onComplete(e) {
        wx.hideLoading()
    },
    onProgress(e) {
       
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  cancel:function(){
       this.setData({
        showAuth:false
      })
  },

  submitForm(e){
    const uInfo = app.globalData.userInfo || null

    if(!uInfo){

    this.setData({
        showAuth:true
      })
      return  
    }

    const postData=Object.assign({
      store_name:app.globalData.userInfo.nickname,
      wechatnumber:this.data.wechatnumber,
      realname:this.data.realname,
      mobile:this.data.mobile
    })

    util.wx.post('/api/user/store_apply',postData).then(res=>{

    if(res.data.code == 200){
        wx.showToast({
        title:'提交成功',
        icon:'none'
      })


            const d = res.data.data

            app.globalData.userInfo = d
         
            wx.setStorage({ //存储到本地
                key: "userInfo",
                data: d,
                success:function(){
                  wx.redirectTo({
                    url:'/pages/home/index'
                  })
                }
            })
          }else{

            return    wx.showToast({
        title:res.data.msg,
        icon:'none'
      })
          }

    }).catch(e=>{

      console.log(e)

    })



  },

  getUserInfoEvt: function(e) {
      console.log(e)
      if (e.detail.errMsg !== "getUserInfo:ok") {
          return wx.showToast({ 'title': '允许一下又不会怀孕', icon: 'none' })
      }

      this.setData({
                      showAuth: false
                    })

      app.globalData.userInfo = e.detail.userInfo
      wx.showLoading()
      app.getOpenId().then((openid) => {
          app.globalData.openid = openid
          app.login_third(e.detail).then((res) => {
                  wx.hideLoading()
                
                  console.log(this.submitForm,e)
                 this.submitForm(this.form)


                  const uInfo = app.globalData.userInfo

                  if(uInfo.hasOwnProperty('store_id')){
                      // wx.redirectTo({
                      //   url:'/pages/home/index'
                      // })
                  }else{

                   this.setData({
                      showAuth: false,
                      store_logo:uInfo.headimg || '',
                      store_name:uInfo.nickname || ''
                   })



                  }

              
              })
              .catch(e => console.log(e))
      })

  },
  inputDuplex:util.inputDuplex,

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})