const util = require('../../../utils/util')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      loading: false,
      showAuth: false,
      supplier_logo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //未登录 弹出授权弹窗
    if (!app.globalData.userInfo) {
        setTimeout(() => {
            this.setData({
                showAuth: true
            })
        }, 5000)
    }
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

  submitForm(e){
    let _this = this;

    util.checkMobile(e.detail.value.supplier_mobile)

    const postData=Object.assign({supplier_logo:this.data.supplier_logo},e.detail.value)
    util.wx.post('/api/user/apply_supplier',postData).then(res=>{

      wx.showToast({
        title:'提交成功',
        icon:'none'
      })

    },res=>{
      console.log(res)
      wx.showModal({
        content: res.data.msg,
        showCancel: false,
        success (res) {
          if (res.confirm) {
            _this.toHome()
          }
        }
      })
    }).catch(e=>{

      console.log(e)

    })



  },
  toHome(){

        wx.redirectTo({
            url: '../home/index'
        })
    },

     getUserInfoEvt: function(e) {
        console.log(e)
        if (e.detail.errMsg !== "getUserInfo:ok") {
            return wx.showToast({ 'title': '允许一下又不会怀孕', icon: 'none' })
        }

        app.globalData.userInfo = e.detail.userInfo
        wx.showLoading()
        app.getOpenId().then((openid) => {
            app.globalData.openid = openid
            app.login_third(e.detail).then((res) => {
                    wx.hideLoading()
                    wx.showToast({
                        title: '登录成功',
                        icon: 'none'
                    })

                    this.setData({
                        showAuth: false
                    })
                })
                .catch(e => console.log(e))
        })

    },
    rejectAuth() {
        this.setData({
            showAuth: false
        })
    },

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

  },
  onShareAppMessage: function() {
   
    return {
        title: '创建供应商主页',
        imageUrl: ''        
    }
  },
})