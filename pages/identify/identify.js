const app = getApp()
const { $Message } = require('../../iView/base/index')
const util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        wxnumber: '',
        photoUrl:'',
        wx_collection_code:''
    },
    postInfo() {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/set_user_info',
            method: 'post',
            data: {
                token: app.globalData.token,
                mobile: this.data.mobile,
                wxnumber: this.data.wxnumber,
                wx_collection_code:this.data.wx_collection_code,
                session_key:wx.getStorageSync('session_key')

            },
            success: (res) => {
                if (res.data.code == 0) {
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
            }
        })
    },
    changeMobile(e){
        console.log(e.detail.detail.value)
        this.setData({
            mobile:e.detail.detail.value
        })
    },
    changeWX(e){

        console.log(e.detail.detail.value)
          this.setData({
            wxnumber:e.detail.detail.value
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
     //上传相册
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
        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_user_info',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        mobile: res.data.data.userinfo.mobile ,
                        wxnumber:res.data.data.userinfo.wxnumber,
                        wx_collection_code:res.data.data.store.wx_collection_code
                    })

                }
            }
        })
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