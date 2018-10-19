const app = getApp()
const {  $Message } = require('../../iView/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    give_type:1,//送货方式
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
    console.log(e.detail.errMsg) 
    console.log(e.detail.iv) 
    console.log(e.detail.encryptedData) 
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
      let cart = wx.getStorageSync('cart')

      cart.forEach(value=> amountMoney +=parseInt(value.price*100)*parseInt(value.item_num))




    this.setData({
      nickName: app.globalData.userInfo.nickname,
      goods_id:options.goods_id,
      cart:wx.getStorageSync('cart') || [],
      address:wx.getStorageSync('goods').sell_address[0].address,
      amountMoney:amountMoney/100,
      cover_pic:wx.getStorageSync('goods').cover_pic,
      goods_name:wx.getStorageSync('goods').goods_name,
        })


 wx.getLocation({
  type: 'wgs84',
  success: function(res) {
    var latitude = res.latitude
    var longitude = res.longitude
    var speed = res.speed
    var accuracy = res.accuracy
  }
})


    
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
                      'province_name': '河北省', 
                      'city_name': '廊坊市', 
                      'district_name': '安次区', 
                      'address': '北小营小区5号楼301', 
                      'mobile': this.data.mobile || '13333333333'
                    }
                   ]
           },
           success:  (res) =>{

            if(res.data.code !== 0){
              return $Message({
                content:res.data.msg
              })
            }




                this.pay(res.data.data.order_id,1)
           }
              }
              )
    
  },
  sendTemplateMessage(){

  },
   pay:function(order_id,total_fee) {  
   var total_fee = total_fee;   
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
              
                wx.request({
                  url:'https://www.daohangwa.com/api/pay/orderpay',
                  data:{
                  token:app.globalData.token,
                  order_id:order_id
                  }

                })

                wx.redirectTo({
                  url:'../paySuccess/index?order_id='+order_id
                })
                
              },
              fail: function (res) { 
               
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