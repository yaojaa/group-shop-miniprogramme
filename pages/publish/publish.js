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
date.setDate(date.getDate() + 7);
const default_end_time = util.formatTime(date)


Page({
  data: {
    painterData: {},
    link_url:"",
    goods_id:"",
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
      store_count:'',
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
                name: '快递邮寄',
            },
            {
                name: '用户自提'
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
            store_count:''
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
          this.data.content_imgs = this.data.content_imgs.concat([result])

          this.setData({
            content_imgs:this.data.content_imgs
          })

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


        // if(app.globalData.sell_address){

        //   this.setData({
        //     sell_address:app.globalData.sell_address
        //   })
          
        //   wx.setStorage({
        //     key: 'nowCheckAddress',
        //     data: this.data.sell_address,
        //     success(e) { }
        //   })


        // }

        // console.log(this.data.sell_address)

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
          this.data.photoUrls = this.data.photoUrls.concat([result])

          this.setData({
            photoUrls:this.data.photoUrls
          })

        },
        progressState:(s)=>{
          this.setData({
          photoProgress:s
        })

        }
      })
  },
  //删除一张照片
  removePhoto:function(e){
   let index =e.currentTarget.dataset.index
  

    this.data.photoUrls.splice(index,1)
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
  jump(){
      wx.redirectTo({
        url:'../publish-success/publish-success?goods_id='+this.data.goods_id
     })
  },
    //提交表单
    submitForm(e) {

        if(this.data.photoUrls.length <=0 ){
           wx.showModal({title:'请上传商品相册',showCancel:false})
            return false
        }


     // 传入表单数据，调用验证方法
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0]
            wx.showModal({title:error.msg,showCancel:false})
            return false
        } 


        //校验规则名
        let hasKeyName = true;
        
        this.data.spec_item.every((value,index)=>{

          if(value.key_name.trim() =='' || value.price.trim()==''){

            hasKeyName = false

             return false

          }else{
            return true
          }

        })

        if(!hasKeyName){
           wx.showModal({title:'请填写规则名称和价格',showCancel:false})
           return 
        }

           
       
        if(this.data.sell_address.length<=0){
           wx.showModal({title:'请选择地理位置',showCancel:false})
            return false
        }

        //默认重置库存为1000
        this.data.spec_item.forEach((value,index)=>{

          if(value.store_count ==''){
            this.data.spec_item[index].store_count = 1000
          }

        })
        


        let data = Object.assign({token:app.globalData.token},
          {goods_id:this.data.goods_id},
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
           
           /**** 生成分享卡片配置 ***/
          const reg2=/([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g

          let _content = e.detail.value.goods_content
             _content =_content.replace(reg2,"").replace(/\n/g," ")

          let cardLocalData={
            headImg:app.globalData.userInfo.head_pic,
            userName:app.globalData.userInfo.nickname,
            date:this.data.sell_end_time,
            content:_content
          }

           wx.removeStorageSync('_card_data')

           try {
              wx.setStorageSync('_card_data', cardLocalData)
            } catch (e) { 

              console.log(e)

           }




           //提交
           wx.request({
           method:'post',
           url: 'https://www.daohangwa.com/api/seller/add_edit_goods',
              data,
              success:  (res) =>{
                 wx.hideLoading()
                if (res.data.code == 0) {
                  this.setData({
                      goods_id:res.data.data.goods_id
                    })
                    this.jump()

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
     handleCancel2 () {
      this.setData({
          visible2: false
      })
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
        if(option.goods_id){

          this.setData({
            goods_id:option.goods_id
          })

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



                if(d.code == 0){

                  this.setData({
                    photoUrls:d.data.images,
                    goods_name:gs.goods_name,
                    goods_content:gs.goods_content,
                    sell_address:res.data.data.sell_address,
                    delivery_method:gs.delivery_method,
                    content_imgs:gs.content_imgs || [],
                      sell_start_time:starFormatTime,
                      sell_end_time :endFormatTime,
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
 
 
  inputDuplex:util.inputDuplex
})
