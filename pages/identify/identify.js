const app = getApp()
const { $Message } = require('../../iView/base/index')
const util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        wxnumber: ''
    },

    getInfo(){

        util.wx.get('/api/user/user_info').then(res=>{
            console.log(res)

            if (res.data.code == 200) {
                  this.setData({
                    mobile:'',
                    wxnumber:''
                  })
                }else{
                 $Message({
                        content: res.data.msg,
                        type: 'error'
                    });
                }
                
                
                
        })



    },
    postInfo() {
        util.wx.post('/api/user/user_set_info',{

                mobile: this.data.mobile,
                wxnumber: this.data.wxnumber
        }).then(res=>{
            console.log(res)

            if (res.data.code == 200) {
                    $Message({
                        content: '保存成功',
                        type: 'success'
                    });
                }else{
                 $Message({
                        content: res.data.msg,
                        type: 'error'
                    });
                }
                
                
                
        })
        
    },
    changeMobile(e){
        console.log(e)
        this.setData({
            mobile:e.detail.value
        })
    },
    changeWX(e){

          this.setData({
            wxnumber:e.detail.value
        })
    },
    getPhoneNumber(e) {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_wx_mobile',
            method: 'post',
            data: {
                token: app.globalData.token,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
                session_key:wx.getStorageSync('session_key')

            },
            success: (res) => {
                this.setData({
                    mobile: res.data.data.phoneNumber
                })

            }
        })
    },
    clearStorage(){

wx.clearStorageSync() 

wx.redrectTo({
    url:'../login/login'
})

     //上传相册
    },
  chooseImage:function(e){

    console.log(e.currentTarget.dataset.type)

    const key = e.currentTarget.dataset.type

      util.uploadPicture({
        successData:(result)=>{

          this.setData({
            [key]:result 
          })

        },
        progressState:(s)=>{
          this.setData({
          photoProgress:s
        })

        }
      })
  },

    //预览图片
  imgPreview: function(event) {
        console.log(event.currentTarget.dataset)
        var src = event.currentTarget.dataset.src; //获取data-src
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    },
    removePhoto(){

        this.setData({
            wx_collection_code:''
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.getInfo()
  
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})