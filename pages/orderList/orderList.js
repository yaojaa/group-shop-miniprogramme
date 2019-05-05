//index.js
//获取应用实例
const app = getApp()

const paytypes = ['货到付款', '微信支付'];
const status = ['未付款', '未发货', '已发货', '已完成', '订单关闭'];
Page({
  data: {
    paytypes,
    status,
    orders: [],
    visible1: false,
    cont: '',
    value: 0,
    current: 'tab1'
  },
  getData(){
    util.wx.get('/api/user/get_order_list')
    .then(res=>{
       if(res.data.code == 200){
        this.setData({
          orders:res.data.data.order_list
        })
       }
    })
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
    this.getData()
  }
})
