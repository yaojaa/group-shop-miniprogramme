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
  onLoad: function (option) {
    this.getData()
  }
})
