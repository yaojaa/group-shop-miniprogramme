const util = require('../../utils/util')
const app = getApp()

function fmtDate(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}


Page({

            /**
             * 页面的初始数据
             */
            data: {
                list: [],
                date: '',
                dateModal: false,
                minDate: new Date(1950, 1, 1).getTime(),
                currentDate: new Date().getTime(),
                maxDate: new Date(2050, 1, 1).getTime(),
                scopeModal: false,
                type: '0', // 红包类型
                title: '亲，给你送红包啦！', //红包名称
                reduce: '', //红包减的金额
                total: '', //红包数量
                stop_time: '', // 过期时间
                goods_limit: 0, //限制商品

                typeModal: false,
                scopeValue: '',
                scopeTitle: '',
                checked: false,
                typeTitle: '',
                userSelectVisble: true,
                customerList: [],
                customers: [],
                customerVisible: false,
                goodsVisible: false,
                goodslist: [],
                cpage: 1
            },
            onChange({ detail }) {
                // 需要手动对 checked 状态进行更新
                this.setData({ checked: detail });
            },
            handleDateModal() {
                this.setData({
                    dateModal: !this.data.dateModal
                });
            },
            handleDate(event) {
                this.setData({
                    stop_time: fmtDate(event.detail),
                    dateModal: !this.data.dateModal
                });
                console.log(fmtDate(event.detail))
            },
            showTypeModal() {

                this.setData({
                    typeModal: !this.data.typeModal
                });

            },
            handleScopeModal() {
                this.setData({
                    goodsVisible: true,
                    goodslist: []
                });

                this.getGoodsList()
            },
            changeScope(event) {
                this.setData({
                    scopeValue: event.target.dataset.name,
                    scopeTitle: event.target.dataset.title,
                    scopeModal: false
                });
            },

            changeType(event) {
                this.setData({
                    type: event.target.dataset.name,
                    typeTitle: event.target.dataset.title,
                    typeModal: false
                })
            },
            /**
             * 生命周期函数--监听页面加载
             */
            onLoad: function(options) {

                this.getCustomers()

            },
            //创建优惠券
            createCoupon() {


                if (this.data.title == '') {
                    return wx.showToast({
                        title: '请填写名称',
                        icon: 'none'
                    })
                }


                if (this.data.reduce.trim() == '') {
                    return wx.showToast({
                        title: '请填写红包金额',
                        icon: 'none'
                    })
                }



                util.wx.post('/api/redpacket/add_redpacket', {
                        redpacket: {
                            type: this.data.type,
                            title: this.data.title,
                            reduce: this.data.reduce,
                            total: this.data.total,
                            stop_time: this.data.stop_time,
                            full: this.data.full
                        }
                    }).then(res => {
                            if (res.data.code == 200) {

                                wx.showModal({
                                    title: '创建成功',
                                    showCancel: false, //是否显示取消按钮
                                    confirmText: "确定", //默认是“确定”
                                    confirmColor: 'green', //确定文字的颜色
                                })
                                
                            }
                        })
                    },

                    checkboxChange(e) {
                        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
                        this.data.customers = e.detail.value
                    },
                    onCustomerClose() {
                        this.setData({
                            customers: this.data.customers
                        })
                    },
                    showUserSelect() {
                        this.setData({
                            customerVisible: true
                        })
                    },

                    getGoodsList: function() {
                        let ajaxData = {
                            cpage: this.data.cpage,
                            pagesize: 15
                        };
                        if (this.data.searchWords) {
                            ajaxData.keyword = this.data.searchWords
                        }
                        this.setData({
                            is_loading: true
                        });

                        util.wx
                            .get('/api/seller/get_goods_list', ajaxData)
                            .then((res) => {
                                console.log(res);
                                // if (this.data.searchWords) {
                                //     //搜索
                                //     this.searchLoadData(res);
                                //     return;
                                // }

                                if (res.data.code == 200) {
                                    this.setData({
                                        goodslist: this.data.goodslist.concat(res.data.data.goodslist),
                                        is_loading: false
                                    });

                                    this.data.goodslist.forEach((item) => {
                                        if (item._order_status1_count > 0) {
                                            this.setData({
                                                hasNewOrder: true
                                            });
                                        }
                                    });

                                    this.totalpage = res.data.data.page.totalpage;
                                } else {
                                    this.setData({
                                        is_loading: false
                                    });
                                }
                            })
                            .catch((e) => {
                                // if (this.data.searchWords) {
                                //     this.setData({
                                //         search_is_loading: false
                                //     });
                                // } else {
                                this.setData({
                                    is_loading: false
                                });
                                // }
                            });
                    },

                    scrolltolower() {

                        // }
                        ++this.data.cpage;

                        if (this.data.cpage <= this.totalpage) {
                            this.getGoodsList(); //重新调用请求获取下一页数据
                        } else {
                            this.data.cpage = this.totalpage;
                        }
                    },


                    /**
                     * 生命周期函数--监听页面初次渲染完成
                     */
                    onReady: function() {

                    },

                    /**
                     * 生命周期函数--监听页面显示
                     */
                    onShow: function() {

                    },

                    /**
                     * 生命周期函数--监听页面隐藏
                     */
                    onHide: function() {

                    },

                    /**
                     * 获取粉丝列表
                     */
                    getCustomers(params) {
                        this.setData({
                            loading: true
                        })
                        let data = {
                            sortstr: '',
                            cpage: 1,
                            pagesize: 15
                        }

                        if (this.data.searchWords) {
                            data.keyword = this.data.searchWords
                        }

                        console.log(data)

                        return new Promise((resolve, reject) => {
                            util.wx.get('/api/seller/get_fans_list', data).then((res) => {
                                this.setData({
                                    loading: false,
                                    customerList: this.data.list.concat(res.data.data.lists)
                                })
                                resolve(res)
                            }, (err) => {
                                reject(err)
                            })
                        })

                    },
                    inputDuplex: util.inputDuplex,



                    /**
                     * 用户点击右上角分享
                     */
                    onShareAppMessage: function() {

                    }
            })