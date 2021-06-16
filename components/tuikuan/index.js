const util = require('../../utils/util.js');

Component({
    externalClasses: ['custom-class'],
    properties: {
        loading: {
            type: Boolean,
            value: false
        },
        refund_fee: {
            type: Number,
            value: 0
        },
        order_id: {
            type: String,
            value: ''
        },
        user_id: {
            type: String,
            value: ''
        }
    },
    options: {

    },
    data: {
        visible: false,
        explain: ''
    },
    methods: {
        setRefund_fee(e) {
            // console.log(e)
            // this.data.refund_fee = e
        },
        setExplain(e) {

            console.log(e)
            this.data.explain = e.detail

        },

        to_refund() {

            console.log(this.visible)

            this.setData({
                visible: true
            })



        },
        refund() {

            // 主动退款 
            //   api/seller/order_active_refund
            // 参数:
            //   order_id  //订单id
            //   reason    //退款原因
            //   explain   //退款说明

            //   spec：[{“detail_id”:1, “num”:1},{“detail_id”:2, “num”:3},{“detail_id”:3, “num”:10}]
            //         }
            //         
            util.wx.post('/api/seller/order_active_refund', {
                order_id: this.data.order_id,
                refund_fee: this.data.refund_fee,
                reason: '商户退款',
                explain: this.data.explain,
                user_id: this.data.user_id
            }).then(res => {
                if (res.data.code == 200) {

                    wx.showToast({
                        title: '退款成功',
                        icon: "none"
                    })

                    this.triggerEvent('tkSuccess')

                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none"
                    })
                }
            })


        }

    },
    ready() {
        //console.log(this.data.item)
    }
})