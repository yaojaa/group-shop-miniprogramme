const app = getApp()
const util = require('../../utils/util')
Page({
  data: {
      orders:[],
      ordersChecked:[],
      result:[],
  },

  onChange(event) {
    this.setData({
      result: event.detail
    });
  },

  onLoad: function(options) {
    this.data.goods_id = options.goods_id

    wx.showLoading()

    util.wx.get('/api/seller/get_order_export_by_goods_id', {
      goods_id: this.data.goods_id
    }).then(res=>{
      res.data.data.orders.forEach( e=>{
        e.qty = 1;
      })
      this.setData({
        orders:res.data.data.orders
      })
        wx.hideLoading()

    })
  },
  copyAll() {
    this.copy(this.data.orders);
  },
  copySend() {
    let opt = this.data.orders.filter( e =>{
      return e.send_status == '未发货'
    })

    this.copy(opt);
  },
  copyChecked() {
    if(this.data.result.length == 0){
      wx.showToast({
        icon: 'none',
        title: '请先选择'
      })
      return;
    }

    this.data.ordersChecked = [];

    this.data.result.forEach( e => {
      this.data.ordersChecked.push(this.data.orders[e])
    })

    this.copy(this.data.ordersChecked);
  },

  copy(opt) {
    let msg = '';
    let lastNum = []
    let dup_txt = ''

    opt.forEach( (item, i) => {

      lastNum.push(item.create_number)

      if(item.create_number == lastNum[i-1]){
        console.log('重复1')
        dup_txt='（同上面地址再加一件）'
      }else{
        dup_txt=''
      }

      msg += `${item.create_number}、 ${dup_txt}${item.province}${item.city}${item.district}${item.address}, ${item.consignee}, ${item.mobile}, ${item.spec_name}, ${item.qty}件\n\n`

    })

    msg +='【以上共'+opt.length+'件】'

    wx.setClipboardData({
        data: msg,
        success: function(res) {
            wx.getClipboardData({
                success: function(res) {
                    wx.showToast({
                        title: '复制成功'+opt.length+'个'
                    })
                }
            })
        }
    })
  }


})