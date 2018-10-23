//index.js
//获取应用实例
const util = require('../../utils/util')
const {  $Message } = require('../../iView/base/index');
// import * as zrender from '../../utils/zrender/zrender';
// import * as zrhelper from '../../utils/zrender/zrender-helper';
import Card from '../../palette/card'; 
const qiniuUploader = require("../../utils/qiniuUploader");
let cardConfig = {};

const app = getApp()

Page({
    data: {
      hasScope:false,//是否授权
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
        orderUsers: [],
        painterData: {},
        imagePath: "",
  },
  onReady: function () {

    app.getUserInfoScopeSetting().then(res=>{

      this.setData({
        hasScope:res
      })


    })

  },
  onImgOk(e) { //绘制成功
    let _this = this;
    qiniuUploader.upload(e.detail.path, (rslt) => {
      _this.setData({
        imagePath: `http://img.daohangwa.com/${rslt.key}`
      })
    })
  },
  onImgErr(e) { //绘制失败
    console.log("绘制失败=======>>>>", e)
  },
    onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target,this.data.goods.goods_id)
    }

    // let zr = zrhelper.createZrender('canvas-1', 360, 720);

    // var image = new zrender.Image({
    //     style: {
    //         x: 0,
    //         y: 0,
    //         image: '../../images/koala.jpg',
    //         width: 32,
    //         height: 24,
    //         text: 'koala'
    //     }
    // });
    // zr.add(image);


    return {
      title: '开团啦！'+this.data.goods.goods_name,
      imageUrl: this.data.imagePath,
      path: '/pages/goods/goods?goods_id='+this.data.goods.goods_id  
    }
  },
    onLoad: function(option) {
        console.log('token',app.globalData.token)

      util.getShareImg(option.goods_id, this);

        wx.request({
            url: 'https://www.daohangwa.com/api/goods/get_goods_info',
            data: {
                // token :app.globalData.token,
                goods_id: option.goods_id
            },
            success: (res) => {
                if (res.data.code == 0) {

                  console.log(res.data.data.goods)

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

                  // cardConfig = {  //绘制配置
                  //   headImg: this.data.seller_user.head_pic,
                  //   userName: this.data.seller_user.nickname,
                  //   address: res.data.data.sell_address[0].name,
                  //   date: util.formatTime(new Date(res.data.data.goods.sell_end_time * 1000)).replace(/^(\d{4}-)|(:\d{2})$/g,""),
                  //   content: this.data.goods.goods_content,
                  //   headsImgArr: []
                  // };

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
   getUserInfoEvt: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.login_third(e.detail).then((res)=>{ 
          console.group('登陆成功:',res)
                     this.buy()
                    })
    .catch( e => console.log(e) )

  },
  getOrderUserList(goods_id) {

    wx.request({
      method: 'post',
      url: 'https://www.daohangwa.com/api/goods/get_buyusers_by_goodsid',
      data: {
        token: app.globalData.token,
        goods_id: goods_id
      },
      success: (res) => {



        if (res.data.code == 0) {

          // res.data.data.lists.forEach(e => {
          //   cardConfig.headsImgArr.push(e.user.head_pic)
          // })


          // //绘制图片
          this.setData({
            // painterData: new Card().palette(cardConfig),
            orderUsers: res.data.data.lists,
            orderCount: res.data.data.lists.length
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
          console.log(res)
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy



         this.data.sell_address.forEach(value=>{


                const la2 = value.latitude
                const lo2 = value.longitude

               let dis =  util.distance(latitude,longitude,la2,lo2)
               //大于3公里
               if(dis>3 && this.data.delivery_method ==2){

               $Message({
                content: '您的位置不在取货范围内,请注意！',
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
        wx.setStorageSync('goods',{
          goods_name:this.data.goods.goods_name,
          sell_address:this.data.sell_address,
          cover_pic:this.data.imgUrls[0],
          delivery_method:this.data.goods.delivery_method,
          sell_end_time: this.data.goods.sell_end_time,
          goods_content: this.data.goods.goods_content
        })

        wx.navigateTo({
            url: '../order/index?goods_id='+this.data.goods.goods_id
        })
    }
})



