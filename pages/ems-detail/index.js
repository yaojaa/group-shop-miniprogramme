const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        express_company: '',
        express_code: '',
        express: [],
        currentIndex: null,
        order_id: '',
        errorMsg: '',
        traces: '',
        user: '',
        goods: ''
    },
    checkExpress(options) {
        let currentExpress = this.data.express[options.index];
        if(currentExpress.status){

            this.setData({
                currentIndex: options.index,
                ['express[' + options.index + '].traces']: currentExpress.traces
            })

            return;
        }

        wx.showLoading()
        util.wx.get('/api/order/get_express_info', {
            express_company: options.express_company,
            express_code: options.express_code,
            order_id: options.order_id
            }).then(res => {
            if (res.data.status) { // 物流单号正确


                this.setData({
                    currentIndex: options.index,
                    ['express[' + options.index + '].traces']: res.data.data.traces.reverse(),
                    ['express[' + options.index + '].errorMsg']: '暂时没有物流信息，复制单号到快递官网试试',
                    ['express[' + options.index + '].status']: true
                })
            }else{ // 物流单号错误
                this.data.express_code = "";
                this.data.express_company = "";
                this.setData({
                    currentIndex: options.index,
                    ['express[' + options.index + '].traces']: [],
                    ['express[' + options.index + '].errorMsg']: '快递单号不正确或者暂时没有物流信息 (点击重试)',
                    ['express[' + options.index + '].status']: false
                })

            }
            wx.hideLoading()
        }, err => {
            console.log('===err===',err)
        })
    },
    copyOrder(e) {
        let i = e.currentTarget.dataset.index;
        let currentExpress = this.data.express[i]
        let msg = '物流公司：' + currentExpress.express_company + '\n物流单号:' + currentExpress.express_code + '\n'
        currentExpress.traces&&currentExpress.traces.forEach(e => {
            msg += e.time + '\n' + e.content + '\n'
        })

        wx.setClipboardData({
            data: msg,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
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
                        wx.navigateBack({delta: 2})
                    }
                })
            }
          }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.setData({
        //     express_company:options.name || '',
        //     express_code:options.code || '',
        //     order_id:options.id || ''
        // })

        console.log(options)
        this.data.user = options.user
        this.data.goods = options.goods

        for(let i in options){
            if(i.indexOf('code') > -1){
                this.data.express.push({
                    express_code: options[i],
                    express_company: options['com'+ i.replace('code','')]
                })
            }
        }

        this.setData({
            express: this.data.express,
            order_id: options.order_id
        })

        this.checkExpress({
            order_id: options.order_id,
            express_code: options['code' + options.index],
            express_company: options['com' + options.index],
            index: options.index
        })

         wx.setNavigationBarTitle({
      title: this.data.user+'的物流信息' 
    })
    },
    toCheckExpress(e) {
        let i = e.currentTarget.dataset.index;
        // if(this.data.currentIndex != i){
            this.checkExpress({
                order_id: this.data.order_id,
                express_company: this.data.express[i].express_company,
                express_code: this.data.express[i].express_code,
                index: i
            })
        // }
    },
    onShareAppMessage: function (res) {
    return {
      title: this.data.user+ '的快递单号【'+this.data.goods+'】'
    }
  }
})