//index.js
//
//
//
//获取应用实例
var WxValidate = require("../../utils/wxValidate.js");


const app = getApp()

const util = require('../../utils/util.js')


Page({
  data: {
    photoUrls: [],
    intro_pics:[],
    delivery_method:0,//配送方式
    isGave:0,
    address:0,
    deliver:true,
    morePic:false,
    photoProgress:false,
    pictureProgress:false,
    spec_item:[{
      key_name:'',
      price :'',
      store_count:1000
      }
      ]
    },
    //添加商品
    addGoods:function(){

      const dataTpl = {
            key_name:'',
            price :'',
            store_count:1000
            }

      this.data.spec_item = this.data.spec_item.concat([dataTpl])

      this.setData({
        spec_item: this.data.spec_item
      })

    },
    //删除商品
    removeGoods:function(e){

       
       if(this.data.spec_item.length <=1)  {
        wx.showToast({
         title: '请至少保留一个商品',
         icon:'none'  //标题
       })

        return
      }

      let index =e.currentTarget.dataset.index
         this.data.spec_item.splice(index,1)
          this.setData({
                spec_item:this.data.spec_item
              })
    },
    //添加介绍图片
    addPicture:function(){

      util.uploadPicture({
        successData:(result)=>{
          console.log(result)
          this.data.intro_pics = this.data.intro_pics.concat([result])

          this.setData({
            intro_pics:this.data.intro_pics
          })

          console.log(this.data.intro_pics)
        },
        progressState:(s)=>{
          console.log('上传状态',s)
          this.setData({
          pictureProgress:s
        })

        }
      })
    },
  onLoad:function(){

    console.log('onLoad....')
   
  },
  onShow:function(){
        console.log('onshow....')

  },

  switch2Change:function(e){
    this.setData({ hasType: e.detail.value})
  },
  deliverChange: function (e) {
    this.setData({ deliver: e.detail.value })
  },
  //上传相册
  chooseImage:function(){


      util.uploadPicture({
        successData:(result)=>{
          console.log(result)
          this.data.photoUrls = this.data.photoUrls.concat([result])

          this.setData({
            photoUrls:this.data.photoUrls
          })

          console.log(this.data.photoUrls)
        },
        progressState:(s)=>{
          console.log('上传状态',s)
          this.setData({
          photoProgress:s
        })

        }
      })
  },
  //删除一张照片
  removePhoto:function(e){
    console.log(e)
   let index =e.currentTarget.dataset.index
       console.log(index)
   console.log(this.data.photoUrls)

    this.data.photoUrls.splice(index,1)
   console.log(this.data.photoUrls)
   this.setData({
    'photoUrls':this.data.photoUrls
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



        let data = Object.assign({token:app.globalData.token},
          e.detail.value, //表单的数据
          {spec_item:JSON.stringify(this.data.spec_item)}, //商品数组数据
          {goods_images:this.data.photoUrls},
          {
            sell_address:[],
            delivery_method:1,
            sell_start_time:'',
            sell_end_time :''
          }
          )

           wx.request({
           method:'post',
           header: {

             "content-type": "application/x-www-form-urlencoded"

           },
           url: 'https://www.daohangwa.com/api/seller/add_edit_goods',
              data,
              success:  (res) =>{
                if(res.data.code == 0){

                   wx.showModal({
                        title: '提交成功',
                        showCancel:false
                    })
                 
                }else{
                     wx.showModal({
                        title: res.data.msg,
                        showCancel:false
                    })
                }
              }
           })





     
    },
    deliveryChange:function(e){
      console.log(e)
      this.setData({
        delivery_method:e.detail.value?1:0
      })
    },
    start_time:function(e){
      this.setData({
        sell_start_time:e.detail.join('-')
      })

    },
    end_time:function(e){
        this.setData({
        sell_end_time:e.detail.join('-')
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
