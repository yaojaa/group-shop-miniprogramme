// components/orderlist/orderlist.js
const util = require('../../utils/util.js')
const { $Message } = require('../../iView/base/index');

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
        orders: [],
        cpage:1,
        totalpage:1,
        loading:true,
        total:'--'
    },

  /**
   * 组件的方法列表
   */
  methods: {

    getBuyList() {

        return new Promise((reslove,reject)=>{

        this.data.loading = true

        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_order_list',
            data: {
                token: app.globalData.token,
                cpage:this.data.cpage,
                pagesize:10
            },
            success: (res) => {

                var resdata= []
                if (res.data.code == 0) {

                      if(this.data.cpage<=1){
                               resdata = res.data.data.order_list
                            }else{
                               resdata = this.data.orders.concat(res.data.data.order_list)
                       }


                    this.setData({
                        orders: resdata,
                        loading:false,
                        totalpage:res.data.data.page.totalpage,
                        total:res.data.data.page.total,
                    })
                }
            }
        })

      })
    },
    //取消订单

    cancel_order({ target }) {

        wx.request({
            url: 'https://www.daohangwa.com/api/user/cancel_order',
            method: 'POST',
            data: {
                token: app.globalData.token,
                order_id: target.dataset.id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    $Message({
                        content: '订单取消成功',
                        type: 'success'
                    })
                    this.getBuyList()
                }
            }
        })
    },

    //确认收货
    confirm_order({ target }) {

        wx.request({
            url: 'https://www.daohangwa.com/api/user/confirm_order',
            method: 'POST',
            data: {
                token: app.globalData.token,
                order_id: target.dataset.id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    $Message({
                        content: '确认成功'
                    })
                    this.getBuyList()

                }
            }
        })



    },
    pay({ target }) {


        let order_id = target.dataset.id;
        let goods_id = target.dataset.goods_id;

        let index = target.dataset.idx;
        let _this = this;

        wx.login({
            success: res => {
                var code = res.code;
                wx.request({
                    url: 'https://www.daohangwa.com/api/pay/pay',
                    method: "POST",
                    data: {
                        order_id: order_id,
                        code: code,
                        token: app.globalData.token,

                    },
                    success: function(res) { //后端返回的数据 
                        var data = res.data.data;
                        console.log(data);
                        console.log(data["timeStamp"]);
                        wx.requestPayment({
                            timeStamp: data['timeStamp'],
                            nonceStr: data['nonceStr'],
                            package: data['package'],
                            signType: data['signType'],
                            paySign: data['paySign'],
                            success: function(res) {
                                console.log(res)

                                wx.request({
                                    url: 'https://www.daohangwa.com/api/pay/orderpay',
                                    data: {
                                        token: app.globalData.token,
                                        order_id: order_id
                                    }

                                })

                                wx.showLoading()



                                wx.redirectTo({
                                    url: '../paySuccess/index?order_id=' + order_id + '&goods_id=' + goods_id
                                })

                            },
                            fail: function(res) {
                                console.log("fail", res)
                            }

                        });
                    }
                })
            }
        })

    }

  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      // this.getBuyList()
       console.log('attached')
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})
