const app = getApp()

let address ={}
const { $Message } = require('../../iView/base/index');
const util = require('../../utils/util.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:"",
    link_url:"",
    num: 1,
    delivery_method:2,//送货方式
    consignee:'',
    goods_id:'',
    hasgoods:false,
    address:'',
    province_name:'',
    city_name:'',
    district_name:'',
    // door_number:'',
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
    total:0,
    loading:false,
    create_remark:''
  },

  getaddressList(){

    return new Promise((reslove,reject)=>{ 
      wx.request({
      url:'https://www.daohangwa.com/api/user/get_address_list',
      method:'post',
      data:{
        token:app.globalData.token
      },
      success:(res)=>{

       if(res.data.code ==0 && res.data.data.length>0){

          reslove(res.data.data[0])
   
         }else{
          reject(false)
         }
         },
      fail:()=>{
        reject(false)
      }

       })

    })


    



  },
  getPhoneNumber (e) { 

    wx.request({
      url:'https://www.daohangwa.com/api/user/get_wx_mobile',
      method:'post',
      data:{
        token:app.globalData.token,
        iv:e.detail.iv,
        encryptedData:e.detail.encryptedData,
        session_key:wx.getStorageSync('session_key')
      },
      success:(res)=>{

       if(res.data.code ==0){
           this.setData({
            mobile:res.data.data.phoneNumber
          })

         if(!app.globalData.userInfo.mobile){
           app.globalData.userInfo.mobile = res.data.data.phoneNumber
         } 

       }else{
          $Message({
             content:'哎呦出小差了，麻烦手动填写下'
          })
       }

      },
      fail:()=>{
        $Message({
        content:'哎呦出小差了，麻烦手动填写下'
          })
      }
    })
  } ,
  mobileChange(e){

    this.setData({
      mobile:e.detail.value    
    })
  },

  inputTodata(e){

    let key = e.target.id

      this.setData({
      [key]:e.detail.detail.value    
    })
  },

  handleChange1(e) {


    let id = e.target.id
    let key ="cart["+id+"].item_num"


    this.setData({
      [key]:e.detail.value    
    }, function() {

            let amountMoney = 0;
            this.data.cart.forEach(value=> amountMoney += value.price*100*parseInt(value.item_num))

            let hasgoods = amountMoney == 0?true : false


            this.setData({
              amountMoney:amountMoney/100,
              hasgoods : hasgoods
            })
    })




  },
  getUserloaction(){
    //onload 获取地理位置
    return new Promise((reslove,reject)=>{

       wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          var latitude = res.latitude
          var longitude = res.longitude
          // var speed = res.speed
          // var accuracy = res.accuracy
            wx.request({
            url:'https://apis.map.qq.com/ws/geocoder/v1/?key=FKRBZ-RK4WU-5XMV4-B44DB-D4LOH-G3F73&get_poi=1',
            data:{
              location:latitude+','+longitude
            },
            method:'get',
            success:(res)=>{
              reslove(res.data.result.address_component)
            },
            fail:(err)=>{
             reject(err)
            }

          })
           },
           fail:(err)=>{
            reject(err)
           }
         })

    })

  },

  //获取用户默认地址
  getDefaultAddress(cb){

    let addressObj = {}




        //1邮递    2自提 两种情况默认地址不同
    if(this.data.delivery_method ==1){
      //邮递时 先获取上次存储的位置 为空则默认获取定位位置
      
            this.getaddressList().then((data)=>{
                cb(data)
            },()=>{

          this.getUserloaction().then((map)=>{

          addressObj.province_name = map.province
          addressObj.district_name = map.district
          addressObj.city_name = map.city
          addressObj.address = map.province+map.city+'请输入完整地址'
          return cb(addressObj)

        })

        })


     //自提时候为卖家商品地址
    }else if(this.data.delivery_method ==2){

      let goods_address = wx.getStorageSync('goods').sell_address[0]
       return cb(goods_address)

    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


      let amountMoney = 0;
      let cartSource = wx.getStorageSync('cart')
      let cart = typeof cartSource ==='string' ? JSON.parse(cartSource) : cartSource ;

      let goodsSource = wx.getStorageSync('goods');

      let goods = typeof goodsSource ==='string' ? JSON.parse(goodsSource) : goodsSource ;


      cart.forEach(value=> amountMoney +=parseInt(value.price*100)*parseInt(value.item_num))

      this.setData({
          consignee: app.globalData.userInfo.nickname || wx.getStorageSync('userInfo').nickname,
          goods_id:options.goods_id,
          cart:cart|| [],
          amountMoney:amountMoney/100,
          cover_pic:goods.cover_pic,
          goods_name:goods.goods_name,
          delivery_method:options.delivery_method,
      })


      this.getDefaultAddress((s)=>{

        console.log('getDefaultAddress',s)

        this.setData({
          address:s.address,
          province_name:s.province_name,
          city_name:s.city_name,
          district_name:s.district_name,
          mobile:s.mobile || app.globalData.userInfo.mobile || wx.getStorageSync('userInfo').mobile,
          consignee:s.consignee || app.globalData.userInfo.nickname || wx.getStorageSync('userInfo').nickname

        })

      })


        

      
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  order2pay: function () {


    let address = wx.getStorageSync('goods').sell_address[0].address


      if(this.data.nickName ==''){
      $Message({
        content:'请填写收货人'
      })
      return
    }


   

    if(this.data.mobile ==''){
      $Message({
        content:'请填写手机号码'
      })
      return
    }


    if(this.data.delivery_method ==1 && this.data.address.length<8){
      wx.showToast({
        title:'请填写完整收货地址',
        icon:'none'
      })
      return
    }



    // if(this.data.delivery_method ==1 && this.data.door_number.length<4 ){
    //   $Message({
    //     content:'请填写门牌号'
    //   })
    // }

         //清除购物车里为0的。

    this.data.cart.forEach((value,index)=>{

      if(value.item_num == 0){
        this.data.cart.splice(index,1)
        this.setData({
          cart:this.data.cart
        })
      }

    })


    let addressData = {
                      'consignee': this.data.consignee, 
                      'province_name': this.data.province_name,
                      'city_name': this.data.city_name,
                      'district_name': this.data.district_name,
                      'address': this.data.address, 
                      'mobile': this.data.mobile
                    }


     this.setData({
      loading:true
     })

     wx.request({
           method:'post',
           url: 'https://www.daohangwa.com/api/cart/create_order',
           data:{
            token :app.globalData.token,
            goods_id:this.data.goods_id,
            spec_item:this.data.cart,
            create_remark:this.data.create_remark,
            address:[addressData]
           },
           success:  (res) =>{

            if(res.data.code !== 0){
              this.setData({
                  loading: false
              })
              return $Message({
                content:res.data.msg
              })
            }

            app.globalData.userInfo.address = addressData


              this.data.order_id = res.data.data.order_id;

            this.pay(parseInt(this.data.order_id))
           }
              }
              )
    
  },

   pay:function(order_id) {  

    console.log(this)
     var _this = this;
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
       success:  (res)=> {  //后端返回的数据 
             var data = res.data.data;          
        
         wx.requestPayment({
              timeStamp: data['timeStamp'],
              nonceStr: data['nonceStr'], 
              package: data['package'], 
              signType: data['signType'], 
              paySign: data['paySign'], 
              success:  (res) =>{ 

                wx.showLoading()

                wx.request({
                  url:'https://www.daohangwa.com/api/pay/orderpay',
                  data:{
                    token:app.globalData.token,
                    order_id:order_id,
                  },
                  success:()=>{

                   wx.hideLoading()
                    this.setData({
                    loading:false
                   })
                   wx.redirectTo({
                         url:'../paySuccess/index?order_id='+order_id+'&goods_id='+this.data.goods_id
                   })

                  }

                })
                
              },
              fail: function (res) { 
                wx.hideLoading()
                wx.redirectTo({
                         url:'../myPartake/index'
                   })
               
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
    
  },
  formSubmit:function(e){
    util.formSubmitCollectFormId.call(this,e)
  }
})