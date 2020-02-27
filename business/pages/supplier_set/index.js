const util = require('../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
      loading:false,
      supplier_logo:'',
      info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getInfo()

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

  getInfo(){


    util.wx.get('/api/supplier/get_supplier_detail').then(res=>{
      this.setData({
        info:res.data.data,
        supplier_logo:res.data.data.supplier_logo
      })
    })


  },

  submitForm(e){

    util.checkMobile(e.detail.value.supplier_mobile)

    const postData=Object.assign({
      supplier_background:'123',
      supplier_logo:this.data.supplier_logo},e.detail.value)
    util.wx.post('/api/supplier/supplier_set',postData).then(res=>{

      wx.showToast({
        title:'提交成功',
        icon:'none'
      })

        wx.navigateBack({
         
            delta: 1  // 返回上一级页面。
         
        })



    },res=>{
      wx.showToast({
        title:res.data.msg,
        icon:"none"
      })

    }).catch(e=>{

      console.log(e)

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

  }
})