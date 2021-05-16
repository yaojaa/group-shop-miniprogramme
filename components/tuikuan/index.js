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
        order_id:{
            type: String,
            value: ''
        }
    },
    options: {

    },
    data: {
        visible: false,
        explain:''
    },
    methods: {
        setRefund_fee(e){
            console.log(e)
            this.data.refund_fee = e
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
                reason: '',
                explain: ''
            }).then(res=>{
                if(res.data.code == 200){}
                    else{
                        wx.showToast({
                            title: res.data.msg,
                            icon : none
                        })
                    }
            })


        }

    },
    ready() {
        //console.log(this.data.item)
    }
})