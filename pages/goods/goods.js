//index.js
//获取应用实例
const util = require('../../utils/util')
const {  $Message } = require('../../iView/base/index');

const app = getApp()

Page({
    data: {
        imgUrls: [
        ],
        goods: {},
        seller_user:{},
        sell_address:[],
        spec_goods_price:[],
        code:false,
        cartPanel:false,
        amountMoney:0,
        countdownTime:0,
        orderCount:0,
        clearTimer:false,
        myFormat:['天', '时', '分', '秒'],
        orderUsers:[]
    }, 
    onShareAppMessage: function (res) {
      console.log(this.data.goods.goods_id)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target,this.data.goods.goods_id)
    }
    return {
      title: '开团啦！'+this.data.goods.goods_name,
      path: '/pages/goods/goods?goods_id='+this.data.goods.goods_id    }
  },
    onLoad: function(option) {
        console.log('token',app.globalData.token)
        wx.request({
            url: 'https://www.daohangwa.com/api/goods/get_goods_info',
            data: {
                token :app.globalData.token,
                goods_id: option.goods_id
            },
            success: (res) => {
                if (res.data.code == 0) {

                  console.log(res.data.data.goods.sell_end_time)

                  let  spec_goods_price = res.data.data.spec_goods_price

                    spec_goods_price.map(value=>{
                     value.item_num = 0 
                    })

                    this.setData({
                        goods: res.data.data.goods,
                        imgUrls:res.data.data.images,
                        sell_address:res.data.data.sell_address,
                        seller_user:res.data.data.seller_user,
                        spec_goods_price:spec_goods_price,
                        countdownTime:new Date(res.data.data.goods.sell_end_time*1000).getTime()
                    })
                }
            
            //计算位置
            this.computeDistance()

            this.getOrderUserList(option.goods_id)

            }
        })
    },
    codeHide(){
      this.setData({
          code:false
      })
    },
    codeShow(){
      this.setData({
          code:true
      })
    },
    handleCountChange(e){
      let id = e.target.id

      let key ="spec_goods_price["+id+"].item_num"

      this.data.spec_goods_price[id].item_num = e.detail.value



      let amountMoney = 0;

      this.data.spec_goods_price.forEach(value=> amountMoney +=parseInt(value.price*100)*parseInt(value.item_num))



      this.setData({
        [key] : e.detail.value,
        amountMoney:amountMoney/100
      })

    },
    cartPanelHide(){
      this.setData({
          cartPanel:false
      })
    },
    cartPanelShow(){
      this.setData({
          cartPanel:true
      })
      
    },
    homepage() {
        wx.navigateTo({
            url: '../home/index'
        })
    },
    getOrderUserList(goods_id){

      wx.request({
            url: 'https://www.daohangwa.com/api/goods/get_buyusers_by_goodsid',
            data: {
                token :app.globalData.token,
                goods_id: goods_id
            },
            success: (res) => {



              if (res.data.code == 0) {
                this.setData({
                  orderUsers:res.data.data.lists,
                  orderCount:res.data.data.lists.length
                })
              }




            }
          })
      

    },
    userpage() {
        wx.navigateTo({
            url: '../orderList/orderList'
        })
    },
    //计算距离
    computeDistance(){


       wx.getLocation({
        type: 'wgs84',
        success: (res) =>{
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy



          this.data.sell_address.forEach(value=>{


      const la2 = value.latitude
      const lo2 = value.longitude

               let dis =  util.distance(latitude,longitude,la2,lo2)
               //大于3公里
               if(dis>3){

               $Message({
                content: '您的位置不在范围内,将不能参与哦',
                type: 'warning',
                duration: 5
              })

               }


          })





        }
      })







    },
    buy() {

      if(this.data.amountMoney == 0){
        return 
      }


      let shopcar = this.data.spec_goods_price.filter(value=> value.item_num>0)
        wx.setStorageSync('cart',shopcar)

        wx.navigateTo({
            url: '../order/index?goods_id='+this.data.goods.goods_id
        })
    }
})