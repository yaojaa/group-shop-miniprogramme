//index.js
//获取应用实例
const app = getApp()

const paytypes = ['货到付款', '微信支付'];
const status = ['未付款', '未发货', '已发货', '已完成', '订单关闭'];
Page({
  data: {
    paytypes,
    status,
    orders: [
      {
        shop: "某某店铺",
        goodname: '新鲜草莓阿萨德六块腹肌阿里山的叫法',
        goodimg: '/img/banner.jpg',
        price: 133.22,
        num: 1,
        discount: 5,
        payment: 128.22,
        id: "0101010",
        state: 0,
        paytype: 1,
        phone: '18311111020'
      }
    ],
    visible1: false,
    cont: '',
    value: 0,
    current: 'tab1'
  },
  fncall(ev){

    let phoneNumber = ev.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber
    })
  },
  topay(){
    // beacon
    wx.setScreenBrightness({
      value: 0.6
    })
    // wx.requestPayment({
    //   timeStamp: new Date() + '',
    //   nonceStr: Math.random().toString(36).substr(2),
    //   package: 'dsdadasd',
    //   signType: 'MD5',
    //   paySign: 'asdfasfasdfas'
    // })
  },
  toDefault() {
    wx.navigateTo({
      url: '/pages/orderDefault/orderDefault',
    })
  },
  onLoad: function (option) {
  }
})
