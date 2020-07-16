const app = getApp()
const util = require('../../utils/util')
Page({
    data: {

        radio: 'pickup',
        note: '',
        goods_id: '',
        disabled: false,
        text: '立即发送'
    },
    onChange(event) {
        console.log(event)
        this.setData({
            radio: event.detail
        });
    },
    onLoad: function(options) {

        if (options.name) {
            this.setData({
                goods_id: options.id,
                goods_name: options.name,
                customerName: options.customer_name,
                order_id: options.order_id
            })
        } else {
            wx.showToast({
                title: '缺少参数goods_id或goods_name',
                icon: 'none'
            })
        }


    },
    bindTextAreaInput(e) {
        this.data.note = e.detail.value
    },
    send() {
        if (this.data.customerName) {
            return this.sendToUser()
        }
        wx.showLoading()
        util.wx.post('/api/seller/send_goods_tmp_msg', {
            type: this.data.radio,
            note: this.data.note,
            goods_id: this.data.goods_id
        }).then(res => {

            wx.hideLoading()

            this.setData({
                disabled: true,
                text: '已发送 请返回'
            })

            wx.showToast({
                title: '发送成功',
                icon: 'none'
            })

        }).catch(e => {
            wx.hideLoading()

            wx.showToast({
                title: e.data.msg,
                icon: 'none'
            })
        })
    },
    sendToUser() {
        wx.showLoading()
        util.wx.post('/api/seller/send_tmp_msg', {
            type: 10,
            note: this.data.note,
            order_ids: [this.data.order_id]
        }).then(res => {

            wx.hideLoading()

            if (res.data.code == 200) {
                this.setData({
                    disabled: true,
                    text: '已发送 请返回'
                })

                wx.showToast({
                    title: '发送成功',
                    icon: 'none'
                })

            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }


        }).catch(e => {
            wx.hideLoading()

            wx.showToast({
                title: e.data.msg,
                icon: 'none'
            })
        })
    }
})