const util = require('../../utils/util')
const app = getApp()

function fmtDate(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "年" + m.substring(m.length - 2, m.length) + "月" + d.substring(d.length - 2, d.length) + '日';
}

// 不带年月日
function fmtDatePre(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + m.substring(m.length - 2, m.length) + d.substring(d.length - 2, d.length);
}


Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        date: '',
        dateModalS: false,
        dateModalE: false,
        minDate: new Date().getTime(),
        start_time: '',
        maxDate: new Date(2050, 1, 1).getTime(),
        scopeModal: false,
        type: '0', // 红包类型
        title: '亲，给你送红包啦！', //红包名称
        reduce: '', //红包减的金额
        days: '',
        total: '', //红包数量
        stop_time: '',
        goods_limit: 0, //限制商品
        typeModal: false,
        scopeValue: '',
        scopeTitle: '',
        checked: false,
        checked2: false,

        typeTitle: '',
        userSelectVisble: true,
        customerList: [],
        customers: [],
        customerVisible: false,
        goodsVisible: false,
        goodslist: [],
        cpage: 1,
        cpage2: 1, //顾客列表
        totalpage2: '',
        step: 0,
        redpacket_id: '',
        goods_ids: [],
        user_ids: [],
        dataType: 'days',
        steps: [{
                text: '第一步',
                desc: '优惠券基本信息',
            },
            {
                text: '步骤二',
                desc: '优惠券使用范围',
            }
        ],
        searchWords: '',
        count:1
    },
    onChange({ detail }) {
        // 需要手动对 checked 状态进行更新
        this.setData({ checked: detail });
    },
    onDateTypeChange({ detail }) {
        console.log(detail)
        if (detail) {
            this.setData({
                days: ''
            })
        }
        // 需要手动对 checked 状态进行更新
        this.setData({ checked2: detail });
    },
    handleDateModalE() {
        this.setData({
            dateModalE: !this.data.dateModalE
        });
    },
    handleDateModalS() {
        this.setData({
            dateModalS: !this.data.dateModalS
        })
    },

    handleDateE(event) {
        console.log(fmtDate(event.detail))
        this.setData({
            stop_time_fmt: fmtDate(event.detail),
            stop_time: event.detail,
            dateModalE: !this.data.dateModalE
        });
    },
    handleDateS(event) {

        console.log(event.detail)

        const time = fmtDate(event.detail)

        console.log(typeof time)

        this.setData({
            start_time: event.detail,
            start_time_fmt: time,
            dateModalS: !this.data.dateModalS
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
        });

        if (this.data.goodslist.length == 0) {
            this.getGoodsList()
        }

    },
    changeScope(event) {
        this.setData({
            scopeValue: event.target.dataset.name,
            scopeTitle: event.target.dataset.title,
            scopeModal: false
        });
    },
    //类型改变事件
    changeType(event) {
        const type = event.target.dataset.name
        console.log(type)
        this.setData({
            type,
            typeTitle: event.target.dataset.title,
            typeModal: false
        })

        if(type==1){
            this.setData({
                title:'亲，你的专属红包到啦'
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {


    },
    changeDays(e) {


        this.data.days = e.detail

        if (e.detail) {
            this.setData({
                checked2: false
            })
        }

        console.log(e)
    },

    changeCount(e) {
        this.data.count = e.detail
        console.log(e)
    },

    //创建优惠券
    createCoupon() {

        console.log(this.data.checked2)



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

        if (this.data.type == 0 && this.data.total.trim() == '') {
            return wx.showToast({
                title: '请填写红包数量',
                icon: 'none'
            })
        }

        if (!this.data.checked2 && this.data.days.trim() == '') {
            return wx.showToast({
                title: '请填写有效天数',
                icon: 'none'
            })
        }




        if (this.data.checked2 && this.data.start_time == '') {
            return wx.showToast({
                title: '请填写生效日期',
                icon: 'none'
            })
        }
        if (this.data.checked2 && this.data.stop_time == '') {
            return wx.showToast({
                title: '请填写失效日期',
                icon: 'none'
            })
        }



        wx.showLoading()

        let param = {
            type: this.data.type,
            title: this.data.title,
            reduce: this.data.reduce,
            total: this.data.total,
            full: this.data.full || 0
        }

        //日期类型
        if (this.data.checked2) {

            param.days = ''

            param.stop_time = fmtDatePre(this.data.stop_time) + '23:59:59'
            //day 类型
            param.start_time = fmtDatePre(this.data.start_time) + '00:00:00'
            //day 类型
        } else {


            param.start_time = ''
            param.stop_time = ''

            param.days = this.data.days


        }


        console.log(param)


        util.wx.post('/api/redpacket/add_redpacket', {
            redpacket: param
        }).then(res => {
            wx.hideLoading()

            if (res.data.code == 200) {

                this.setData({
                    step: 1,
                    redpacket_id: res.data.data.redpacket_id
                })


                // wx.showModal({
                //     title: '创建成功',
                //     showCancel: false, //是否显示取消按钮
                //     confirmText: "确定", //默认是“确定”
                //     confirmColor: 'green', //确定文字的颜色
                // })

            } else {

                wx.showModal({
                    title: '创建失败',
                    showCancel: false, //是否显示取消按钮
                    confirmText: "确定", //默认是“确定”
                    confirmColor: 'green', //确定文字的颜色
                })


            }
        }).catch(e => {
            wx.showToast({
                title: '创建失败',
                icon: 'none'
            })
        })
    },
    // 搜索
    onSearch(e) {
        var sv = e.detail.replace(/(^\s*)|(\s*$)/g, '');
        console.log(sv);
        if (sv) {
            this.data.cpage = 1;
            this.setData({
                searchWords: sv,
                goodslist: [],
                is_loading: true
            });
            this.getGoodsList();
        } else {
            this.onCancel()
        }
    },
    onCancel() {
        this.data.cpage = 1;
        this.setData({
            searchWords: '',
            goodslist: [],
            is_loading: true
        });
        this.getGoodsList();
    },

     // 搜索
    onSearch2(e) {
        var sv = e.detail.replace(/(^\s*)|(\s*$)/g, '');
        console.log(sv);
        if (sv) {
            this.data.cpage2 = 1;
            this.setData({
                userWords: sv,
                customerList: [],
                is_loading: true
            });
            this.getCustomers();
        } else {
            this.onCancel2()
        }
    },
    onCancel2() {
        this.data.cpage2 = 1;
        this.setData({
            userWords: '',
            customerList: [],
            is_loading: true
        });
        this.getCustomers();
    },

    goodscheckboxChange(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        this.data.goods_ids = e.detail.value
    },

    checkboxChange(e) {
        this.setData({
            user_ids: e.detail.value
        })

    },
    onCustomerClose() {
        this.setData({
            customers: this.data.customers
        })
    },
    confirmGoods() {
        this.setData({
            goods_ids: this.data.goods_ids
        })
    },
    showUserSelect() {
        this.setData({
            customerVisible: true
        })

        if (this.data.user_ids.length == 0) {
            this.getCustomers()
        }



    },

    bindredpacket() {

        if (this.data.type == 1 && this.data.user_ids.length == 0) {
            wx.showToast({
                title: '指定红包，请选择客人',
                icon: 'none'
            })

            return
        }

        if (this.data.type == 3 && this.data.goods_ids.length == 0) {
            wx.showToast({
                title: '请指定商品',
                icon: 'none'
            })

            return

        }


        if (this.data.type !== 1 && this.data.goods_ids.length == 0) {

            wx.showToast({
                title: '创建成功',
                icon: 'none'
            })

            wx.redirectTo({
                url: '/pages/coupon/index'
            })


        }







        // if (this.data.type == 1 && this.data.user_ids.length > 0) {
        //     this.sendToUser()
        // }



        if (this.data.type !== 1 && this.data.goods_ids.length > 0) {

            util.wx
                .post('/api/redpacket/bind_redpacket', {
                    goods_ids: this.data.goods_ids,
                    redpacket_id: this.data.redpacket_id,
                    count: this.data.count 

                })
                .then((res) => {

                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '创建成功',
                            icon: 'none'
                        })

                        wx.redirectTo({
                            url: '/pages/coupon/index'
                        })

                    }

                })

        }



    },

    /*发送红包给指定客户*/
    sendToUser() {
        util.wx.post('/api/redpacket/alloc_redpacket', {
            user_ids: this.data.user_ids,
            redpacket_id: this.data.redpacket_id,
            count: this.data.count 

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
                // if (this.data.searchWords) {
                //     //搜索
                //     this.searchLoadData(res);
                //     return;
                // }
                if (res.data.code == 200) {

                    let goodsdata = res.data.data.goodslist

                    console.log(goodsdata)

                    this.data.goods_ids.forEach(id => {

                        goodsdata.forEach(gs => {
                            if (gs.goods_id == id) {
                                gs.checked = true
                            }
                        })


                    })

                    console.log(goodsdata)



                    this.setData({
                        goodslist: this.data.goodslist.concat(goodsdata),
                        is_loading: false
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


    scrolltolower2() {

        console.log('scrolltolower2scrolltolower2')

        // }
        ++this.data.cpage2;

        if (this.data.cpage2 <= this.data.totalpage2) {
            this.getCustomers(); //重新调用请求获取下一页数据
        } else {
            this.data.cpage2 = this.data.totalpage2;
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
            cpage: this.data.cpage2,
            pagesize: 15
        }

        if (this.data.userWords) {
            data.keyword = this.data.userWords
        }

        console.log(data)

        return new Promise((resolve, reject) => {
            util.wx.get('/api/seller/get_fans_list', data).then((res) => {
                this.setData({
                    loading: false,
                    customerList: this.data.customerList.concat(res.data.data.lists),
                    totalpage2: res.data.data.page.totalpage
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