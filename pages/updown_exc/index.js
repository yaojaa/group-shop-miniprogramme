const util = require('../../utils/util.js');
let data = {};
let flag = true;
let role = "seller";


Page({

    /**
     * 页面的初始数据
     */
    data: {
        startDate: ['2019-10-21', '00:00:00'],
        endDate: ['2019-10-21', '23:59:59'],
        goods_id: '',
        timeFlag: 0, // 0 今天  1 昨天  2 全部  3 自定义
        result: [],
        option1: [
            { text: '待发货', value: 0 },
            { text: '已发货', value: 1 },
        ],
        option2: [
            { text: '按商品选择', value: 0 },
            { text: '全部商品', value: 1 }
        ],
        option3: [
            { text: '未导出', value: 0 },
            { text: '已导出', value: 1 }
        ],
        value1: '0', // 未发货
        value2: '0', // 按商品选择
        value3: '0', // 未导出
        list: [],
        listmore: true,
        show: false,
        active: 0,
        is_batch: true,
        historyList: []

    },
    popShow() {
        this.setData({
            show: true
        })
    },
    onClose() {
        this.setData({
            show: false
        })
    },
    on_is_batch_change({ detail }) {
        this.setData({
            is_batch: detail
        })
    },

    getExportHistory() {

        wx.showLoading()

        util.wx.get('/api/seller/get_exported_histories?goods_id=' + this.data.goods_id).then(res => {
            wx.hideLoading()
            console.log(res.data.code == 200)
            if (res.data.code == 200) {
                this.setData({
                    historyList: res.data.data.histories
                })
            }
        })



    },

    onChange1(event) {
        let val = event.detail;
        this.setData({
            value1: val
        });

        if (val == 1) return

        data = {
            cpage: 1,
            send_status: val,
            export_status: val == 0 ? this.data.value3 : -1
        }

        this.getGoodsOrders(data);
    },

    onChange2(event) {
        let val = event.detail;
        this.setData({
            value2: event.detail,
        });
    },

    onChange3(event) {
        this.setData({
            value3: event.detail
        });

        console.log(event.detail)

        //待发货
        if (event.detail == 0) {

            data = {
                cpage: 1,
                send_status: this.data.value1,
                export_status: this.data.value3
            }

            this.getGoodsOrders(data);

        }

        //已发货
        if (event.detail == 1) {

            this.getExportHistory()
        }


    },

    onTabChange(event) {

        this.setData({
            active: event.detail.index
        })

        if (this.data.historyList.length == 0 && event.detail.index == 1) {

            this.getExportHistory()

        }
    },
    checkorder(e) {
        console.log(e)
        const spec_id = e.currentTarget.dataset.id

        wx.navigateTo({
            url: '../spec-order-list/list?role=' + role + '&spec_id=' + spec_id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.goods_id = options.goods_id;
        if (this.data.goods_id) {
            this.setData({
                value2: 0,
                isGoodsOrder: true //有商品ID的订单 不显示商品选择
            })
        }
        role = options.role ? options.role : "seller";

        let t = util.formatTime(new Date());
        t = t.split(' ')

        console.log(t)

        this.setData({
            startDate: [t[0], '00:00:00'],
            endDate: t
        })
        data = {
            cpage: 1,
            export_status: 0,
            send_status: 0
        }
        this.getGoodsOrders(data);



    },
    /**生成全部表格**/
    getExcelUrl() {

        util.wx.get('/api/seller/order_export_by_goods_id', {
            goods_id: this.data.goods_id
        }).then(res => {
            if (res.data.code == 200) {

              const path = res.data.data.filepath

                wx.setClipboardData({
                    data: path,
                    success: function(res) {
                        wx.showModal({
                            title: '下载链接已复制',
                            content: '可在浏览器中访问下载表格，或者直接发送给好友，注意保密哦！'+path,
                            confirmText: "我知道了", //默认是“确定”
                            showCancel: false, //是否显示取消按钮

                        });
                    }
                });


            }
        })

    },
    onReachBottom: function() {
        // ++ data.cpage;
        // this.getGoodsOrders(data)
    },
    // 获取商品订单
    getGoodsOrders(_data) {
      
        wx.showLoading()
        util.wx.get('/api/' + role + '/order_export_show', { goods_id: this.data.goods_id }).then(res => {
            wx.hideLoading()




            if (res.data.code == 200) {

                this.setData({
                    list: res.data.data.spec_list
                })

            } else if (res.data.code == 0) {

                this.setData({
                    list: []
                })


            }

            console.log(this.data.list)
        })
    },

    // 开始时间
    bindStartDateChange(e) {
        let t = e.detail;

        this.setData({
            startDate: [`${t[0]}-${t[1]}-${t[2]}`, `${t[3]}:${t[4]}`]
        })

    },
    // 结束时间
    bindEndDateChange(e) {
        let t = e.detail;

        this.setData({
            endDate: [`${t[0]}-${t[1]}-${t[2]}`, `${t[3]}:${t[4]}`]
        })
    },

    // todayOrder
    todayOrder() {
        let t = util.formatTime(new Date());
        t = t.split(' ')

        console.log(t)

        this.setData({
            timeFlag: 0,
            startDate: [t[0], '00:00:00'],
            endDate: t
        })

    },

    // yesterdayOrder
    yesterdayOrder() {
        let t = util.formatTime(new Date() - 24 * 60 * 60 * 1000);
        t = t.split(' ');


        console.log(t)

        this.setData({
            timeFlag: 1,
            startDate: [t[0], '00:00:00'],
            endDate: [t[0], '23:59:59']
        })

    },

    // all
    allOrder() {
        this.setData({
            timeFlag: 2,
        })

    },

    // 自定义
    userOrders() {
        this.setData({
            timeFlag: 3,
        })

    },

    // 生成链接并复制
    exportExcel() {
        // let _this = this;
        // let thisData = {}
        // if(this.data.value1 == 1){
        //   thisData = {
        //     send_status: 1,
        //     goods_spec_id_arr: [],
        //     start_date: this.data.startDate[0] + ' ' + this.data.startDate[1],
        //     end_date: this.data.endDate[0] + ' ' + this.data.endDate[1]
        //   }
        //   if(this.data.goods_id){
        //     thisData.goods_id = this.data.goods_id;
        //   }
        // }else if(this.data.value2 == 1){
        //   thisData = {
        //     send_status: 0,
        //     goods_spec_id_arr: []
        //   }
        //   if(this.data.goods_id){
        //     thisData.goods_id = this.data.goods_id;
        //   }
        // }else{
        //   thisData = {
        //     goods_spec_id_arr: this.data.result,
        //     export_status: this.data.value3,
        //     send_status: this.data.value1
        //   }
        //   if(this.data.list.length == 0 ){
        //     console.log('暂无订单')
        //     return
        //   }
        //   if(thisData.goods_spec_id_arr.length == 0){
        //     wx.showToast({ title: '请先选择要导出的商品', icon: 'none' })
        //     return;
        //   }
        // }

        // thisData.goods_spec_ids = thisData.goods_spec_id_arr.toString();

        let thisData = {
            goods_id: this.data.goods_id,
            is_batch: this.data.is_batch ? 1 : 0

        }
        wx.showLoading({
            title: '正在导出'
        })

        util.wx.post('/api/' + role + '/order_export', thisData).then(res => {

            if (res.data.code == 200) {
                wx.hideLoading()
                let path = res.data.data.filepath

                wx.navigateTo({
                    url: '../export-success/index?path=' + path
                })


            } else {
                wx.showToast({ title: '操作失败' || res.data.msg, duration: 5000, icon: 'none' })
            }

        }).catch(e => {
            wx.hideLoading()
            wx.showToast({
                title: ''
            })
        })

    },
    copylink(e) {
        console.log(e)

        const { link } = e.currentTarget.dataset

        wx.setClipboardData({
            data: link,
            success(res) {

            }
        })

    },
    preview(e) {

        console.log(e)

        const { link } = e.currentTarget.dataset

        wx.showLoading()
        //下载文件，生成临时地址
        wx.downloadFile({
            url: link,
            success(res) {
                // 打开文档
                wx.hideLoading()
                wx.openDocument({
                    filePath: res.tempFilePath,
                    fileType: 'xls',
                    success: function() {
                        wx.hideLoading()
                        wx.removeSavedFile({
                            filePath: res.tempFilePath
                        })
                    }
                });
            }
        })


    }

})