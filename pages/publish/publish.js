//index.js
//
//
//
//获取应用实例
var WxValidate = require("../../utils/wxValidate.js");


const app = getApp()

const util = require('../../utils/util.js')

const date = new Date()

const default_start_time = util.formatTime(date)
date.setDate(date.getDate() + 5);
const default_end_time = util.formatTime(date)

import Card from '../../palette/card';
const qiniuUploader = require("../../utils/qiniuUploader");
let cardConfig = {};
cardConfig.headsImgArr = [];

Page({
  data: {
    painterData: {},
    imagePath: "",
    isShowTimePicker:false,
    photoUrls: [],
    content_imgs:[],
    delivery_method:2,//配送方式配送方式 1:送货 2:自提',
    sell_address:[],
    isGave:0,
    address:0,
    deliver:true,
    morePic:false,
    photoProgress:false,
    pictureProgress:false,
    sell_start_time: default_start_time,
    sell_end_time:default_end_time,
    picker:{
      start_date:default_start_time.split(' ')[0],
      end_date:default_end_time.split(' ')[0],
      start_time:'00:00',
      end_time:'24:00',
    },
    spec_item:[{
      key_name:'',
      price :'',
      store_count:'1000'
      }
      ],
      orderStyle:1,
      visible1:false,
       actions1: [
            {
                name: '当面付款',
            },
            {
                name: '在线支付'
            }
        ],
        actions2: [
            {
                name: '用户自提',
            },
            {
                name: '快递邮寄'
            }
        ]
    },
    showTimePicker:function(){

      this.setData({
        isShowTimePicker:true
      })

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
          this.data.content_imgs = this.data.content_imgs.concat([result])

          this.setData({
            content_imgs:this.data.content_imgs
          })

          console.log(this.data.content_imgs)
        },
        progressState:(s)=>{
          this.setData({
          pictureProgress:s
        })

        }
      })
    },
    removePictrue(e){

   let index =e.currentTarget.dataset.index

    this.data.content_imgs.splice(index,1)
   this.setData({
    'content_imgs':this.data.content_imgs
   })

    },

  onShow:function(option){


        if(app.globalData.sell_address){

          this.setData({
            sell_address:app.globalData.sell_address
          })
          
          wx.setStorage({
            key: 'nowCheckAddress',
            data: this.data.sell_address,
            success(e) { }
          })


        }

        console.log(this.data.sell_address)

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
              required:'请输入描述'
            }
        }
        this.WxValidate = new WxValidate(rules, messages)


  },
  onImgOk(e) { //绘制成功
    let _this = this;
    console.log(e)
    qiniuUploader.upload(e.detail.path, (rslt) => {
      let data = {
        goods_id: this.data.goods_id,
        shareimg: rslt.imageURL
      };
      wx.request({
        method: 'post',
        url: 'https://www.daohangwa.com/api/goods/set_goods_shareimg',
        data,
        success: (res) => {
          wx.hideLoading()
          if (res.data.code == 0) {
             wx.redirectTo({
               url: '../goods/goods?goods_id=' + this.data.goods_id
             })

          } else {
            wx.showModal({
              title: res.data.msg,
              showCancel: false
            })
          }
        }
      })
      // _this.setData({
      //   imagePath: `http://img.daohangwa.com/${rslt.key}`
      // })
    })
  },
  onImgErr(e) { //绘制失败
    console.log("绘制失败=======>>>>", e)
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


        if(this.data.sell_address.length<=0){
           wx.showModal({title:'请选择地理位置',showCancel:false})
            return false
        }

        if(this.data.photoUrls.length <=0 ){
           wx.showModal({title:'请上传商品相册',showCancel:false})
            return false
        }

        if(this.data.spec_item[0].name =='' || this.data.spec_item[0].price == '' ){
           wx.showModal({title:'请填写规则或价格',showCancel:false})
            return false
        }



        let data = Object.assign({token:app.globalData.token},{goods_id:this.data.goods_id},
          e.detail.value, //表单的数据
          {spec_item:this.data.spec_item}, //商品数组数据
          {goods_images:this.data.photoUrls},
          {
            sell_address:this.data.sell_address,
            delivery_method:this.data.delivery_method,
            sell_start_time:this.data.sell_start_time,
            sell_end_time :this.data.sell_end_time,
            content_imgs:this.data.content_imgs
          }
          )
          wx.showLoading()
           //提交
           wx.request({
           method:'post',
           // header: {

           //   "content-type": "application/x-www-form-urlencoded"
           // },
           url: 'https://www.daohangwa.com/api/seller/add_edit_goods',
              data,
              success:  (res) =>{
                if (res.data.code == 0) {
                    //绘制配置
                  cardConfig.headImg = app.globalData.userInfo.head_pic;
                  cardConfig.userName = app.globalData.userInfo.nickname;
                  cardConfig.address = this.data.sell_address;
                  cardConfig.date = util.formatTime(new Date(this.data.sell_end_time)).replace(/^(\d{4}-)|(:\d{2})$/g, "");
                  cardConfig.content = e.detail.value.goods_content;
                  this.data.goods_id = res.data.data.goods_id;

                  this.getOrderUserList(this.data.goods_id)

                  //  wx.redirectTo({
                  //   url:'../goods/goods?goods_id='+res.data.data.goods_id
                  //  })
                 
                }else{
                  wx.hideLoading()
                     wx.showModal({
                        title: res.data.msg,
                        showCancel:false
                    })
                }
              }
           })





     
    },
    deliveryChange:function(e){
      console.log(e.detail.value)
      this.setData({
        delivery_method:e.detail.value?1:2
      })
    },
    start_time:function(e){
      let t = e.detail //"2018", "10", "20", "16", "00"
      this.setData({
        sell_start_time:t[0]+'-'+t[1]+'-'+t[2]+' '+t[3]+':'+t[4]
      })

    },
    end_time:function(e){
        let t = e.detail //"2018", "10", "20", "16", "00"

        this.setData({
        sell_end_time:t[0]+'-'+t[1]+'-'+t[2]+' '+t[3]+':'+t[4]
      })

    },
    handleOpen1 () {
        this.setData({
            visible1: true
        });
    },
    handleOpen2 () {
        this.setData({
            visible2: true
        });
    },
     handleCancel1 () {
        this.setData({
            visible1: false
        });
    },
    handleClickItem1 ({ detail }) {
        const index = detail.index + 1;

         this.setData({
            orderStyle:index,
            visible1: false
        });
    },

    handleClickItem2 ({ detail }) {
        const index = detail.index + 1;

         this.setData({
            delivery_method:index,
            visible2: false
        });
    },
    onLoad: function (option) {


        //编辑的时候
        //
           console.log('发布页onLoad：',option.goods_id)

        if(option.goods_id){
          this.data.goods_id = option.goods_id


          wx.request({
           method:'get',
           url: 'https://www.daohangwa.com/api/seller/get_goods_detail',
           data:{
            token :app.globalData.token,
            goods_id:option.goods_id
           },
              success:  (res) =>{


                let d =res.data
                let gs =res.data.data.goods



                let starFormatTime = util.formatTime(new Date(gs.sell_start_time*1000))
                let endFormatTime = util.formatTime(new Date(gs.sell_end_time*1000))

                console.log('返回的开始时间',starFormatTime)
                console.log('返回的结束时间',endFormatTime)

                if(d.code == 0){

                  this.setData({
                    photoUrls:d.data.images,
                    goods_name:gs.goods_name,
                    goods_content:gs.goods_content,
                    sell_address:res.data.data.sell_address,
                    delivery_method:gs.delivery_method,
                    content_imgs:gs.content_imgs,
                      sell_start_time:gs.sell_start_time,
                      sell_end_time :gs.sell_end_time,
                      picker:{
                        start_date:starFormatTime.split(' ')[0],
                        start_time:starFormatTime.split(' ')[1],
                        end_date:endFormatTime.split(' ')[0],
                        end_time:endFormatTime.split(' ')[1],
                      },
                      spec_item:res.data.data.spec_goods_price,
                      isShowTimePicker:true
                  })
                  app.globalData.sell_address = this.data.sell_address


                  wx.setStorage({
                    key: 'nowCheckAddress',
                    data: this.data.sell_address,
                    success(e) { }
                  })

                 
                }else{
                     wx.showModal({
                        title: res.data.msg,
                        showCancel:false
                    })
                }
              }
           })

        }


    this.initValidate()


  },
  getOrderUserList(goods_id) {

    wx.request({
      url: 'https://www.daohangwa.com/api/goods/get_buyusers_by_goodsid',
      data: {
        token: app.globalData.token,
        goods_id: goods_id
      },
      success: (res) => {



        if (res.data.code == 0) {

          res.data.data.lists.forEach(e => {
            cardConfig.headsImgArr.push(e.user.head_pic)
          })


          //绘制图片
          this.setData({
            painterData: new Card().palette(cardConfig)
          })

        }




      }
    })


  },
  inputDuplex:util.inputDuplex
})
