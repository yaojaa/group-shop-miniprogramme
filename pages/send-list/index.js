// pages/paySuccess/index.js
const app = getApp()
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders:[],
        result:[],

    },
      onChange(event) {
    this.setData({
      result: event.detail
    });
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.goods_id = options.goods_id
          util.wx.get('/api/seller/get_order_export_by_goods_id', {
                goods_id: this.data.goods_id
            }).then(res=>{
                this.setData({

                    orders:res.data.data.orders

                })
            })
    }
})