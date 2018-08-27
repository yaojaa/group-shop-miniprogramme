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
        state: 1,
        paytype: '1',
        phone: '18311111020'
      }
    ]
  },
  fncall(ev){
    let phoneNumber = ev.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber
    })
  },
  onLoad: function (option) {
  }
})
