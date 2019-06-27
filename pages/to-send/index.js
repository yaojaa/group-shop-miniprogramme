const app = getApp()
const util = require('../../utils/util.js')

Page({
    data: {
        columns: [],
        comps: [],
        express_company: '选择快递',
        express_code: '输入单号',
        action_remark: '',
        get_user_name: '',
        get_user_avatar: '',
        traces: [],
        showTraces: false,
        checked: false,
        emsPopup: false
    },
    handleEmsPopup() {
        this.setData({
          emsPopup: !this.data.emsPopup
        })
    },
    changeEms(e){
       const { value } = e.detail;
       this.setData({
            express_company: value,
            emsPopup: !this.data.emsPopup
        })
    },
    onLoad: function(opt) {
        this.setData({
            order_id: opt.order_id,
            get_user_name: opt.get_user_name,
            get_user_avatar: opt.get_user_avatar
        })
        this.getData()
    },
    onSwitch(e) {
        console.log(e)
        this.setData({ checked: e.detail });
    },
    onChange(event) {
        const { value } = event.detail;
        this.data.express_company = value
    },
    close() {
        this.setData({
            showTraces: false
        })
    },
    send() {
        let _this = this;
        wx.showModal({
          content: '是否确认发货？',
          success (res) {
            if (res.confirm) {
                util.wx.post('/api/seller/set_order_status', {
                    order_id: _this.data.order_id,
                    opt: 'toset_send',
                    action_remark: _this.data.action_remark,
                    express_company: _this.data.express_company,
                    express_code: _this.data.express_code
                }).then(res => {
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '发货成功'
                        })
                        wx.navigateBack()
                    }
                })
            }
          }
        })
    },
    // checkExpress() {
    //     wx.showLoading()
    //     util.wx.get('/api/order/get_express_info', {
    //         express_company: this.data.express_company,
    //         express_code: this.data.express_code,
    //         order_id: 12345
    //     }).then(res => {
    //         if (res.data.code == 200) {
    //             this.setData({
    //                 showTraces: true,
    //                 traces: res.data.data.traces.reverse()
    //             })
    //         }
    //         wx.hideLoading()

    //     })
    // },
    getData() {
        util.wx.get('/api/index/get_express_code').then(res => {
            if (res.data.code == 200) {
                this.setData({
                    columns: res.data.data.map(item => {
                        return item.name
                    })
                })
            }
        })
    },
    inputDuplex: util.inputDuplex
})