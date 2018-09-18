//index.js
//
//
//
//获取应用实例
var WxValidate = require("../../utils/wxValidate.js");

const qiniuUploader = require("../../utils/qiniuUploader");

const app = getApp()

const util = require('../../utils/util.js')

Page({
  data: {
    imgUrls: [
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    price: 5000,
    type: {},
    isGave:0,
    address:0,
    deliver:true,
    morePic:false,
    goodsInfo:[{
      name:'',
      price :'',
      stock:1000
      }
      ]
    },
    //添加商品
    addNew:function(){

      const dataTpl = {
      name:'',
      price :'',
      stock:1000
      }
      this.data.goodsInfo = this.data.goodsInfo.concat([dataTpl])

      this.setData({
        goodsInfo: this.data.goodsInfo
      })

    },
    //删除商品
    removeGoods:function(e){

      console.log(e)
      let index =e.currentTarget.dataset.index
      console.log(index)

         this.data.goodsInfo.splice(index,1)


          this.setData({
                goodsInfo:this.data.goodsInfo
              })

    },
  onLoad:function(){
   
  },

  switch2Change:function(e){
    this.setData({ hasType: e.detail.value})
  },
  deliverChange: function (e) {
    this.setData({ deliver: e.detail.value })
  },
  chooseImage:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },
  handleAnimalChange:function(event){

    const detail = event.detail;
        this.setData({
            'morePic' : detail.value
        })
  },
  navigateToAddress: function () {
    wx.navigateTo({
      url: '../../address/list/list'
    });
  },
  chooseMap:function(e){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.chooseLocation({
          success:function(res){
            console.log(res)
          }
        })
      }
    })

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  initValidate:function(){
        // 验证字段的规则
        const rules = {
            goods_name:{
              required:true
            },
            goods_content:{
              required:true
            }
        }

        // 验证字段的提示信息，若不传则调用默认的信息
        const messages = {
            goods_name:{
              required:'请输入标题'
            },
            goods_content:{
              goods_content:'请输入描述'
            }
        }
        this.WxValidate = new WxValidate(rules, messages)


  },
  //提交表单
    submitForm(e) {


        console.log(e.detail.value)

     // 传入表单数据，调用验证方法
        if (!this.WxValidate.checkForm(e)) {
          console.log(this.WxValidate.errorList)
            const error = this.WxValidate.errorList[0]
            wx.showModal({title:error.msg,showCancel:false})
            return false
        } 


        let data = Object.assign({token:app.globalData.token},e.detail.value)

           wx.request({
           url: 'https://www.daohangwa.com/api/seller/add_edit_goods',
              data,
              success:  (res) =>{
                if(res.data.code == 0){
                 
                }
              }
           })




 wx.showModal({
            title: '提交成功',
            showCancel:false
        })
     
    },
  onLoad: function () {

    this.initValidate()


 

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  inputDuplex:util.inputDuplex
})
