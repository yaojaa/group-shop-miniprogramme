const app = getApp()

let address ={}
const { $Message } = require('../../iView/base/index');
const util = require('../../utils/util.js')
const qiniuUploader = require("../../utils/qiniuUploader");
const cardConfig = {};//绘制卡片配置信息
cardConfig.headsImgArr = [];//绘制卡片订购头像集合

Page({

  /**
   * 页面的初始数据
   */
  data: {
    painterData: {},
    imagePath: "",
    order_id:"",
    num: 1,
    delivery_method:1,//送货方式
    nickName:'',
    goods_id:'',
    hasgoods:false,
    address:'',
    goods_name:'',
    cover_pic:'',
    mobile:'',
    pay: [{
      id: 1,
      name: '在线支付',
    }, {
      id: 2,
      name: '货到付款'
    }],
    current: '在线支付',
    position: 'right',
    cart:[],
    total:0
  },
  getPhoneNumber (e) { 

    wx.request({
      url:'https://www.daohangwa.com/api/user/get_wx_mobile',
      method:'post',
      data:{
        token:app.globalData.token,
        iv:e.detail.iv,
        encryptedData:e.detail.encryptedData
      },
      success:(res)=>{

        this.setData({
          mobile:res.data.data.phoneNumber
        })

      }
    })
  } ,
  mobileChange(e){

    this.setData({
      mobile:e.detail.value    
    })

  },
  handleChange1(e) {


    let id = e.target.id
    let key ="cart["+id+"].item_num"

 
    this.setData({
      [key]:e.detail.value    
    }, function() {

            let amountMoney = 0;
            this.data.cart.forEach(value=> amountMoney +=value.price*parseInt(value.item_num))

            let hasgoods = amountMoney == 0?true : false


            this.setData({
              amountMoney:amountMoney,
              hasgoods : hasgoods
            })
    })




  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


      let amountMoney = 0;
      let cart = wx.getStorageSync('cart');
      let goods = wx.getStorageSync('goods');

      cart.forEach(value=> amountMoney +=parseInt(value.price*100)*parseInt(value.item_num))

      console.log(app.globalData.userInfo.nickname)
       

    this.setData({
      nickName: app.globalData.userInfo.nickname,
      goods_id:options.goods_id,
      cart:wx.getStorageSync('cart') || [],
      address:wx.getStorageSync('goods').sell_address[0].address,
      amountMoney:amountMoney/100,
      cover_pic:wx.getStorageSync('goods').cover_pic,
      goods_name:wx.getStorageSync('goods').goods_name,
      delivery_method:wx.getStorageSync('goods').delivery_method,
      mobile:app.globalData.userInfo.mobile
        })
      


    //绘制配置
    cardConfig.headImg = app.globalData.userInfo.head_pic;
    cardConfig.userName = app.globalData.userInfo.nickname;

    cardConfig.address = this.data.address;
    cardConfig.date = util.formatTime(new Date(goods.sell_end_time * 1000)).replace(/^(\d{4}-)|(:\d{2})$/g, "");
    cardConfig.content = goods.goods_content;


    //1邮递2自提 两种情况默认地址不同
    if(this.data.delivery_method ==1){
      //address =

    }else if(this.data.delivery_method ==2){

      //address =


    }


//onload 获取地理位置
 wx.getLocation({
  type: 'wgs84',
  success: function(res) {
    var latitude = res.latitude
    var longitude = res.longitude
    var speed = res.speed
    var accuracy = res.accuracy
       wx.request({
      url:'https://apis.map.qq.com/ws/geocoder/v1/?location=39.984154,116.307490&key=FKRBZ-RK4WU-5XMV4-B44DB-D4LOH-G3F73&get_poi=1',
      method:'get',
      success:(res)=>{

        address = res.data.result.address_component

      }
    })





  }
})


    
  },

  onImgOk(e) { //绘制成功
    let _this = this;
    console.log(e)
    qiniuUploader.upload(e.detail.path, (rslt) => {
      let data = {
        goods_id: _this.data.goods_id,
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
              url: '../paySuccess/index?order_id=' + _this.data.order_id + "&goods_id=" + _this.data.goods_id
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  order2pay: function () {

    let address = wx.getStorageSync('goods').sell_address[0].address


    if(this.data.mobile ==''){
      $Message({
        content:'请填写手机号码'
      })
      return
    }

     wx.request({
           method:'post',
           url: 'https://www.daohangwa.com/api/cart/create_order',
           data:{
            token :app.globalData.token,
            goods_id:this.data.goods_id,
            spec_item:wx.getStorageSync('cart'),
            consignee: this.data.nickName,
            address:[{'consignee': this.data.nickName, 
                      'province_name': '0', 
                      'city_name': '0', 
                      'district_name': '0', 
                      'address': address, 
                      'mobile': this.data.mobile
                    }
                   ]
           },
           success:  (res) =>{

            if(res.data.code !== 0){
              return $Message({
                content:res.data.msg
              })
            }


              this.data.order_id = res.data.data.order_id;

                this.pay(parseInt(res.data.data.order_id))
           }
              }
              )
    
  },

   pay:function(order_id) {  
     let _this = this;
       wx.login({ success: res => { 
       var code = res.code;      
       wx.request({
       url: 'https://www.daohangwa.com/api/pay/pay',
       method: "POST", 
       data: { 
        order_id:order_id,
       code: code, 
       token :app.globalData.token,

       }, 
       success: function (res) {  //后端返回的数据 
             var data = res.data.data;          
             console.log(data);          
             console.log(data["timeStamp"]);          
         wx.requestPayment({
              timeStamp: data['timeStamp'],
              nonceStr: data['nonceStr'], 
              package: data['package'], 
              signType: data['signType'], 
              paySign: data['paySign'], 
              success: function (res) { 

                util.drawShareImg(cardConfig, _this.data.goods_id, _this);
                wx.hideLoading()
                wx.request({
                  url:'https://www.daohangwa.com/api/pay/orderpay',
                  data:{
                    token:app.globalData.token,
                    order_id:order_id,
                  },
                  success:()=>{}

                })
                
              },
              fail: function (res) { 
                console.log("pay",res)
               
               }
                  
  });  
 //                       
 //                         
 //                             
             }
           })
    }
  })  

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})